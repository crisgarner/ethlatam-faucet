import { expect } from "chai";
import { ethers } from "hardhat";
import { FaucetVault } from "../typechain-types";

describe("FaucetVault", function () {
  // We define a fixture to reuse the same setup in every test.

  let faucetVault: FaucetVault;
  const daiDrop = ethers.utils.parseEther("10");
  const gasDrop = ethers.utils.parseEther("0.0015");
  const treasury = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";

  before(async () => {
    // const [owner] = await ethers.getSigners();
    const FaucetVaultFactory = await ethers.getContractFactory("FaucetVault");
    faucetVault = (await FaucetVaultFactory.deploy(gasDrop, daiDrop, treasury)) as FaucetVault;
    await faucetVault.deployed();
  });

  describe("Deployment", function () {
    it("Should have the right values on deploy", async function () {
      //   expect(await faucetVault.greeting()).to.equal("Building Unstoppable Apps!!!");
      const [owner] = await ethers.getSigners();
      expect(await faucetVault.gasDrop()).to.equal(gasDrop);
      expect(await faucetVault.daiDrop()).to.equal(daiDrop);
      expect(await faucetVault.treasury()).to.equal(treasury);
      expect(await faucetVault.owner()).to.equal(owner.address);
    });

    it("Should allow owner to send funds for gas", async function () {
      //   const newGreeting = "Learn Scaffold-ETH 2! :)";
      //   await yourContract.setGreeting(newGreeting);
      //   expect(await yourContract.greeting()).to.equal(newGreeting);
    });

    it("Should allow owner to send funds for voting", async function () {
        //   const newGreeting = "Learn Scaffold-ETH 2! :)";
        //   await yourContract.setGreeting(newGreeting);
        //   expect(await yourContract.greeting()).to.equal(newGreeting);
      });

      it("Should allow coordinator to send funds to treasury after two weeks", async function () {
        //   const newGreeting = "Learn Scaffold-ETH 2! :)";
        //   await yourContract.setGreeting(newGreeting);
        //   expect(await yourContract.greeting()).to.equal(newGreeting);
      });
  });
});
