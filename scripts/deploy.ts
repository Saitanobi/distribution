// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Dist = await ethers.getContractFactory("EthDistribute");
  const dist = await Dist.deploy(
    "0x65271eFDBcE385D61013aCaA6165c4cd150300aC",
    "0x33ED1431AE820e6A5eB8dfC93510ee62e7873456",
    "0x8e5bDe5A981339ccB7518010dEaF69AFe4Ae1c87"
  );

  await dist.deployed();

  console.log("Dist deployed to:", dist.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
