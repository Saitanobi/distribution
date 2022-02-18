import { expect } from "chai";
import { ethers } from "hardhat";

const MKTNG = "0x65271eFDBcE385D61013aCaA6165c4cd150300aC";
const DEV = "0x33ED1431AE820e6A5eB8dfC93510ee62e7873456";
const TRSRY = "0x8e5bDe5A981339ccB7518010dEaF69AFe4Ae1c87";

describe("Distribution Contract", function () {
  it("Should deposit and distribute ETH", async function () {

    const signers = await ethers.getSigners();
    // We get the contract to deploy
    const Dist = await ethers.getContractFactory("EthDistribute");
    const dist = await Dist.deploy(MKTNG, DEV, TRSRY);

    await dist.deployed();

    await (await signers[1].sendTransaction({ to: dist.address, value: ethers.utils.parseEther('10.0') })).wait();

    // Check contract has 10 ETH in it
    expect(await ethers.provider.getBalance(dist.address)).to.equal(ethers.utils.parseEther('10.0'));

    // Get prior address balances
    const priorMktngBalance = Number(ethers.utils.formatEther(await ethers.provider.getBalance(MKTNG)));
    const priorDevBalance = Number(ethers.utils.formatEther(await ethers.provider.getBalance(DEV)));
    const priorTrsryBalance = Number(ethers.utils.formatEther(await ethers.provider.getBalance(TRSRY)));

    await (await dist.connect(signers[0]).claim()).wait();

    // Get address balances after distribution
    const newMktngBalance = Number(ethers.utils.formatEther(await ethers.provider.getBalance(MKTNG)));
    const newDevBalance = Number(ethers.utils.formatEther(await ethers.provider.getBalance(DEV)));
    const newTrsryBalance = Number(ethers.utils.formatEther(await ethers.provider.getBalance(TRSRY)));    

    // Check marketing address received 40% of 10 ETH (4 ETH)
    expect(newMktngBalance).to.equal(priorMktngBalance + 4);

    // Check dev address received 10% of 10 ETH (1 ETH)
    expect(newDevBalance).to.equal(priorDevBalance + 1);

    // Check Treasury address received 50% of 10 ETH (5 ETH)
    expect(newTrsryBalance).to.equal(priorTrsryBalance + 5);

    // Check contract has nothing left
    expect(await ethers.provider.getBalance(dist.address)).to.equal('0');
  });

  it("Should adjust ratios and distribute accordingly", async function () {

    const signers = await ethers.getSigners();
    // We get the contract to deploy
    const Dist = await ethers.getContractFactory("EthDistribute");
    const dist = await Dist.deploy(MKTNG, DEV, TRSRY);

    await dist.deployed();

    await (await signers[1].sendTransaction({ to: dist.address, value: ethers.utils.parseEther('10.0') })).wait();

    // Check contract has 10 ETH in it
    expect(await ethers.provider.getBalance(dist.address)).to.equal(ethers.utils.parseEther('10.0'));

    await (await dist.connect(signers[0]).setNewShares(50, 20, 30)).wait();

    // Get prior address balances
    const priorMktngBalance = Number(ethers.utils.formatEther(await ethers.provider.getBalance(MKTNG)));
    const priorDevBalance = Number(ethers.utils.formatEther(await ethers.provider.getBalance(DEV)));
    const priorTrsryBalance = Number(ethers.utils.formatEther(await ethers.provider.getBalance(TRSRY)));

    await (await dist.connect(signers[0]).claim()).wait();

    // Get address balances after distribution
    const newMktngBalance = Number(ethers.utils.formatEther(await ethers.provider.getBalance(MKTNG)));
    const newDevBalance = Number(ethers.utils.formatEther(await ethers.provider.getBalance(DEV)));
    const newTrsryBalance = Number(ethers.utils.formatEther(await ethers.provider.getBalance(TRSRY)));    

    // Check marketing address received 50% of 10 ETH (5 ETH)
    expect(newMktngBalance).to.equal(priorMktngBalance + 5);

    // Check dev address received 20% of 10 ETH (2 ETH)
    expect(newDevBalance).to.equal(priorDevBalance + 2);

    // Check Treasury address received 30% of 10 ETH (3 ETH)
    expect(newTrsryBalance).to.equal(priorTrsryBalance + 3);

    // Check contract has nothing left
    expect(await ethers.provider.getBalance(dist.address)).to.equal('0');
  });
});
