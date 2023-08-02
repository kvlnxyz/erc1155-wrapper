const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("WERC1155", function () {
  async function deploy() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const WERC1155 = await ethers.getContractFactory("WERC1155");
    const werc1155 = await WERC1155.deploy();

    return { werc1155, owner, otherAccount };
  }

  async function deployOne() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const One = await ethers.getContractFactory("TokenOne");
    const one = await One.deploy(10000000);

    return { one, owner, otherAccount };
  }

  async function deployTwo() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Two = await ethers.getContractFactory("TokenTwo");
    const two = await Two.deploy(100000000);

    return { two, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right owner for WERC1155", async function () {
      const { werc1155, owner } = await loadFixture(deploy);

      expect(await werc1155.owner()).to.equal(owner.address);
    });

    it("Set correct TokenOne balance", async function () {
      const { one, owner } = await loadFixture(deployOne);

      expect(await one.balanceOf(owner.address)).to.equal(10000000);
    });

    it("Set correct TokenTwo balance", async function () {
      const { two, owner } = await loadFixture(deployTwo);

      expect(await two.balanceOf(owner.address)).to.equal(100000000);
    });
  });

  describe("Mint", function () {
    it("Wrap TokenOne and check balance", async function () {
      const { werc1155, owner } = await loadFixture(deploy);
      const { one } = await loadFixture(deployOne);

      await one.approve(werc1155.target, 1000000);
      await werc1155.mint(one.target, 1000, "0x00");

      expect(
        await werc1155.balanceOf(
          owner.address,
          werc1155.typeConversion(one.target)
        )
      ).to.equal(1000);
    });

    it("Wrap TokenTwo and check balance", async function () {
      const { werc1155, owner } = await loadFixture(deploy);
      const { two } = await loadFixture(deployTwo);

      await two.approve(werc1155.target, 1000000);
      await werc1155.mint(two.target, 100, "0x00");

      expect(
        await werc1155.balanceOf(
          owner.address,
          werc1155.typeConversion(two.target)
        )
      ).to.equal(100);
    });
  });

  describe("Burn", function () {
    it("Unwrap TokenOne and check WERC1155 balance", async function () {
      const { werc1155, owner } = await loadFixture(deploy);
      const { one } = await loadFixture(deployOne);

      // Rewrite mint logic
      await one.approve(werc1155.target, 1000000);
      await werc1155.mint(one.target, 1000, "0x00");

      await werc1155.burn(one.target, 1);

      expect(
        await werc1155.balanceOf(
          owner.address,
          werc1155.typeConversion(one.target)
        )
      ).to.equal(999);
    });

    it("Unwrap TokenOne and check token balance", async function () {
      const { werc1155, owner } = await loadFixture(deploy);
      const { one } = await loadFixture(deployOne);

      // Rewrite mint logic
      await one.approve(werc1155.target, 1000000);
      await werc1155.mint(one.target, 1000, "0x00");

      await werc1155.burn(one.target, 1);

      expect(await one.balanceOf(owner.address)).to.equal(9999001);
    });

    it("Unwrap TokenTwo and check WERC1155 balance", async function () {
      const { werc1155, owner } = await loadFixture(deploy);
      const { two } = await loadFixture(deployTwo);

      // Rewrite mint logic
      await two.approve(werc1155.target, 1000000);
      await werc1155.mint(two.target, 10, "0x00");

      await werc1155.burn(two.target, 2);

      expect(
        await werc1155.balanceOf(
          owner.address,
          werc1155.typeConversion(two.target)
        )
      ).to.equal(8);
    });

    it("Unwrap TokenTwo and check token balance", async function () {
      const { werc1155, owner } = await loadFixture(deploy);
      const { two } = await loadFixture(deployTwo);

      // Rewrite mint logic
      await two.approve(werc1155.target, 1000000);
      await werc1155.mint(two.target, 10, "0x00");

      await werc1155.burn(two.target, 2);

      expect(await two.balanceOf(owner.address)).to.equal(99999992);
    });
  });

  describe("Transfer", function () {
    it("Transfer from msg.sender (self)", async function () {
      const { werc1155, owner, otherAccount } = await loadFixture(deploy);
      const { one } = await loadFixture(deployOne);
      const { two } = await loadFixture(deployTwo);

      await one.approve(werc1155.target, 1000000);
      await werc1155.mint(one.target, 100, "0x00");

      await werc1155.safeTransferFrom(
        owner.address,
        otherAccount.address,
        werc1155.typeConversion(one.target),
        3,
        "0x00"
      );
    });
  });
});
