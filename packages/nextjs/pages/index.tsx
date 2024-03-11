import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { ZKEdDSAEventTicketPCDPackage } from "@pcd/zk-eddsa-event-ticket-pcd";
import type { NextPage } from "next";
import { hexToBigInt } from "viem";
import { useAccount } from "wagmi";
import { isZupassPublicKey, useZuAuth } from "zupass-auth";
import { MetaHeader } from "~~/components/MetaHeader";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import { generateWitness } from "~~/utils/scaffold-eth/pcd";
import { DEVCONNECT_VALID_EVENT_IDS } from "~~/utils/zupassConstants";

// Get a valid event id from { supportedEvents } from "zuauth" or https://api.zupass.org/issue/known-ticket-types
const validEventIds = DEVCONNECT_VALID_EVENT_IDS;
const fieldsToReveal = {
  revealAttendeeEmail: true,
  revealEventId: true,
  revealProductId: true,
};

const Home: NextPage = () => {
  const [verifiedFrontend, setVerifiedFrontend] = useState(false);
  const [verifiedBackend, setVerifiedBackend] = useState(false);
  const [verifiedOnChain, setVerifiedOnChain] = useState(false);
  const { authenticate, pcd } = useZuAuth();
  const { address: connectedAddress } = useAccount();
  const faucetRef = useRef<null | HTMLDivElement>(null);

  const getProof = useCallback(async () => {
    if (!connectedAddress) {
      notification.error("Please connect wallet");
      return;
    }
    authenticate(fieldsToReveal, connectedAddress, validEventIds);
  }, [authenticate, connectedAddress]);

  const verifyProofFrontend = async () => {
    if (!pcd) {
      notification.error("No PCD found!");
      return;
    }

    if (!connectedAddress) {
      notification.error("Please connect wallet");
      return;
    }
    const deserializedPCD = await ZKEdDSAEventTicketPCDPackage.deserialize(pcd);

    if (!(await ZKEdDSAEventTicketPCDPackage.verify(deserializedPCD))) {
      notification.error(`[ERROR Frontend] ZK ticket PCD is not valid`);
      return;
    }

    if (!isZupassPublicKey(deserializedPCD.claim.signer)) {
      notification.error(`[ERROR Frontend] PCD is not signed by Zupass`);
      return;
    }

    if (deserializedPCD.claim.watermark.toString() !== hexToBigInt(connectedAddress as `0x${string}`).toString()) {
      notification.error(`[ERROR Frontend] PCD watermark doesn't match`);
      return;
    }

    setVerifiedFrontend(true);
    notification.success(
      <>
        <p className="font-bold m-0">Frontend Verified!</p>
        <p className="m-0">
          The proof has been verified
          <br /> by the frontend.
        </p>
      </>,
    );
  };

  const sendPCDToServer = async () => {
    let response;
    try {
      response = await fetch("/api/verify", {
        method: "POST",
        body: JSON.stringify({
          pcd: pcd,
          address: connectedAddress,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (e) {
      notification.error(`Error: ${e}`);
      return;
    }

    const data = await response.json();
    setVerifiedBackend(true);
    notification.success(
      <>
        <p className="font-bold m-0">Backend Verified!</p>
        <p className="m-0">{data?.message}</p>
      </>,
    );
  };

  // mintItem verifies the proof on-chain and mints an NFT
  const { writeAsync: mintNFT, isLoading: isMintingNFT } = useScaffoldContractWrite({
    contractName: "YourCollectible",
    functionName: "mintItem",
    // @ts-ignore TODO: fix the type later with readonly fixed length bigInt arrays
    args: [pcd ? generateWitness(JSON.parse(pcd)) : undefined],
  });

  const { data: yourBalance } = useScaffoldContractRead({
    contractName: "YourCollectible",
    functionName: "balanceOf",
    args: [connectedAddress],
  });

  const scrollToFaucet = () => {
    if (faucetRef && faucetRef.current !== null) {
      faucetRef.current.scrollIntoView();
    }
  };

  return (
    <>
      <MetaHeader />
      <div className="h-screen flex flex-col items-center justify-center gap-16 px-4 sm:px-8">
        <h1 className="font-pixel">Welcome to ETH Latam Faucet!</h1>
        <div className="w-full flex flex-col sm:flex-row justify-evenly font-pixel gap-8">
          <Link
            className="px-2 sm:px-6 py-2 color-secondary border-4 border-secondary shadow-secondary text-center"
            href="/debug"
          >
            <h3>DEBUG CONTRACTS</h3>
          </Link>
          <button
            className="px-2 sm:px-6 py-2 color-primary border-4 border-primary shadow-primary"
            onClick={scrollToFaucet}
          >
            <h3>USE FAUCET</h3>
          </button>
        </div>
      </div>
      <div className="h-[90%] flex flex-col items-center justify-center font-helvetica" ref={faucetRef}>
        <h2 className="font-pixel">Use Faucet</h2>
        <div className="max-w-[50%]">
          <p>
            Get started with{" "}
            <a className="link" href="https://github.com/proofcarryingdata/zupass" target="_blank">
              Zupass
            </a>{" "}
            to verify PCDs (Proof-Carrying Data). <span className="font-bold">e.g.</span> Devconnect tickets.
          </p>
          <p className="text-sm">
            - Check
            <code className="mx-1 px-1 italic font-bold max-w-full break-words break-all inline-block">
              packages/nextjs/pages/index.tsx
            </code>
            to learn how to ask Zupass for a zero knowledge proof.
          </p>
          <p className="text-sm">
            - Check
            <code className="mx-1 px-1 italic font-bold max-w-full break-words break-all inline-block">
              packages/nextjs/pages/api/verify.tsx
            </code>
            to learn how to verify the proof on the backend and execute any action (in this example it will send 1 ETH
            to the connected address).
          </p>
          <div className="flex flex-col w-full gap-4 mt-8 font-pixel">
            <div className="tooltip" data-tip="Loads the Zupass UI in a modal, where you can prove your PCD.">
              <button
                className="border-4 border-secondary shadow-secondary w-full p-4 disabled:opacity-30"
                onClick={getProof}
                disabled={!!pcd}
              >
                {!pcd ? "1. Get Proof" : "1. Proof Received!"}
              </button>
            </div>
            <div className="tooltip" data-tip="When you get back the PCD, verify it on the frontend.">
              <button
                className="w-full p-4 border-4 border-primary shadow-primary disabled:opacity-30"
                disabled={!pcd || verifiedFrontend}
                onClick={verifyProofFrontend}
              >
                2. Verify (frontend)
              </button>
            </div>
            <div className="tooltip" data-tip="Send the PCD to the server to verify it and execute any action.">
              <button
                className="w-full p-4 border-4 border-primary shadow-primary disabled:opacity-30"
                disabled={!verifiedFrontend || verifiedBackend}
                onClick={sendPCDToServer}
              >
                3. Verify (backend) and send ETH
              </button>
            </div>
            <div className="tooltip" data-tip="Submit the proof to a smart contract to verify it on-chain.">
              <button
                className="w-full p-4 border-4 border-primary shadow-primary disabled:opacity-30"
                disabled={!verifiedBackend || verifiedOnChain}
                onClick={async () => {
                  try {
                    await mintNFT();
                  } catch (e) {
                    notification.error(`Error: ${e}`);
                    return;
                  }
                  setVerifiedOnChain(true);
                }}
              >
                {isMintingNFT ? <span className="loading loading-spinner"></span> : "4. Verify (on-chain) and mint"}
              </button>
            </div>
            <div className="flex justify-center">
              <button
                className="btn btn-ghost text-error underline normal-case"
                onClick={() => {
                  setVerifiedFrontend(false);
                }}
              >
                Reset
              </button>
            </div>
            <div className="text-center text-xl">
              {yourBalance && yourBalance >= 1n ? "🎉 🍾 proof verified in contract!!! 🥂 🎊" : ""}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
