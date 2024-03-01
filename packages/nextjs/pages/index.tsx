import { useCallback, useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useZuAuth } from "zuauth";
import { MetaHeader } from "~~/components/MetaHeader";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import { VALID_EVENT_IDS } from "~~/utils/zupassConstants";

// Get a valid event id from { supportedEvents } from "zuauth" or https://api.zupass.org/issue/known-ticket-types
const validEventIds = VALID_EVENT_IDS;
const fieldsToReveal = {
  revealAttendeeEmail: true,
  revealEventId: true,
  revealIsConsumed: true,
  revealAttendeeSemaphoreId: true
};

const Home: NextPage = () => {
  const [verifiedBackend, setVerifiedBackend] = useState(false);
  const { authenticate, pcd } = useZuAuth();
  const { address: connectedAddress } = useAccount();

  const getProof = useCallback(async () => {
    if (!connectedAddress) {
      notification.error("Please connect wallet");
      return;
    }
    authenticate(
      fieldsToReveal,
      connectedAddress,
      "",
      validEventIds,
      [],
      undefined,
      "ETH LATAM Ticket Proof",
      "Proof that you are the holder of a scanned ETH LATAM Ticket",
    );
  }, [authenticate, connectedAddress]);

  const sendPCDToServer = async () => {
    let response;
    if (!pcd) {
      notification.error("No PCD found!");
      return;
    }

    if (!connectedAddress) {
      notification.error("Please connect wallet");
      return;
    }
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
    console.log(data);
    setVerifiedBackend(true);
    if (data?.error) {
      notification.error(
        <>
          <p className="font-bold m-0">Error</p>
          <p className="m-0">{data?.message}</p>
        </>,
      );
    } else {
      notification.success(
        <>
          <p className="font-bold m-0">Backend Verified!</p>
          <p className="m-0">{data?.message}</p>
        </>,
      );
    }
  };

//   // mintItem verifies the proof on-chain and mints an NFT
//   const { writeAsync: mintNFT, isLoading: isMintingNFT } = useScaffoldContractWrite({
//     contractName: "YourCollectible",
//     functionName: "mintItem",
//     // @ts-ignore TODO: fix the type later with readonly fixed length bigInt arrays
//     args: [pcd ? generateWitness(JSON.parse(pcd)) : undefined],
//   });

  const { data: yourBalance } = useScaffoldContractRead({
    contractName: "YourCollectible",
    functionName: "balanceOf",
    args: [connectedAddress],
  });

  return (
    <>
      <MetaHeader />
      <div className="flex flex-col items-center mt-24">
        <div className="card max-w-[90%] sm:max-w-lg bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">ETH LATAM Faucet</h2>
            <p className="mt-0">
              Get started with{" "}
              <a className="link" href="https://github.com/proofcarryingdata/zupass" target="_blank">
                Zupass
              </a>{" "}
              to verify PCDs (Proof-Carrying Data). <span className="font-bold">e.g.</span> Devconnect tickets.
            </p>
            <p className="text-sm m-0">
              - Check
              <code className="mx-1 px-1 italic bg-base-300 font-bold max-w-full break-words break-all inline-block">
                packages/nextjs/pages/index.tsx
              </code>
              to learn how to ask Zupass for a zero knowledge proof.
            </p>
            <p className="text-sm m-0">
              - Check
              <code className="mx-1 px-1 italic bg-base-300 font-bold max-w-full break-words break-all inline-block">
                packages/nextjs/pages/api/verify.tsx
              </code>
              to learn how to verify the proof on the backend and execute any action (in this example it will send 1 ETH
              to the connected address).
            </p>
            <div className="flex flex-col gap-4 mt-6">
              <div className="tooltip" data-tip="Loads the Zupass UI in a modal, where you can prove your PCD.">
                <button className="btn btn-secondary w-full tooltip" onClick={getProof} disabled={!!pcd}>
                  {!pcd ? "1. Get Proof" : "1. Proof Received!"}
                </button>
              </div>
              <div className="tooltip" data-tip="Send the PCD to the server to verify it and execute any action.">
                <button className="btn btn-primary w-full" disabled={!pcd || verifiedBackend} onClick={sendPCDToServer}>
                  2. Verify (backend) and receive ETH
                </button>
              </div>
              <div className="text-center text-xl">
                {yourBalance && yourBalance >= 1n ? "🎉 🍾 proof verified in contract!!! 🥂 🎊" : ""}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
