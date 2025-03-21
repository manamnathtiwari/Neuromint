import { expect } from 'chai';
import { ethers } from 'hardhat';
import { time } from '@nomicfoundation/hardhat-network-helpers';
import { NeuroMint } from '../typechain-types';

describe('NeuroMint', function () {
  let neuromint: NeuroMint;
  let owner: any;
  let user: any;
  const DEPOSIT_AMOUNT = ethers.parseEther('0.01');

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();
    const NeuroMint = await ethers.getContractFactory('NeuroMint');
    neuromint = await NeuroMint.deploy();
    await neuromint.waitForDeployment();
  });

  describe('Project Submission', function () {
    it('Should allow users to submit projects with correct deposit', async function () {
      const deadline = (await time.latest()) + time.duration.days(7);
      const repoLink = 'https://github.com/test/repo';

      await expect(
        neuromint.connect(user).submitProject(repoLink, deadline, {
          value: DEPOSIT_AMOUNT
        })
      )
        .to.emit(neuromint, 'ProjectSubmitted')
        .withArgs(user.address, repoLink, deadline);

      const project = await neuromint.getProject(user.address);
      expect(project.repoLink).to.equal(repoLink);
      expect(project.deadline).to.equal(deadline);
      expect(project.rewarded).to.be.false;
      expect(project.depositAmount).to.equal(DEPOSIT_AMOUNT);
    });

    it('Should reject submissions with incorrect deposit amount', async function () {
      const deadline = (await time.latest()) + time.duration.days(7);
      await expect(
        neuromint
          .connect(user)
          .submitProject('https://github.com/test/repo', deadline, {
            value: ethers.parseEther('0.02')
          })
      ).to.be.revertedWith('Incorrect deposit amount');
    });

    it('Should reject submissions with past deadline', async function () {
      const deadline = (await time.latest()) - time.duration.days(1);
      await expect(
        neuromint
          .connect(user)
          .submitProject('https://github.com/test/repo', deadline, {
            value: DEPOSIT_AMOUNT
          })
      ).to.be.revertedWith('Deadline must be in future');
    });
  });

  describe('Reward Release', function () {
    beforeEach(async function () {
      const deadline = (await time.latest()) + time.duration.days(7);
      await neuromint
        .connect(user)
        .submitProject('https://github.com/test/repo', deadline, {
          value: DEPOSIT_AMOUNT
        });
    });

    it('Should allow owner to release reward with bonus', async function () {
      const bonus = ethers.parseEther('0.01');
      const initialBalance = await ethers.provider.getBalance(user.address);

      await expect(neuromint.connect(owner).releaseReward(user.address, bonus))
        .to.emit(neuromint, 'RewardReleased')
        .withArgs(user.address, DEPOSIT_AMOUNT + bonus);

      const finalBalance = await ethers.provider.getBalance(user.address);
      expect(finalBalance - initialBalance).to.equal(DEPOSIT_AMOUNT + bonus);
    });

    it('Should prevent non-owners from releasing rewards', async function () {
      await expect(
        neuromint.connect(user).releaseReward(user.address, 0)
      ).to.be.revertedWithCustomError(neuromint, 'OwnableUnauthorizedAccount');
    });

    it('Should prevent double reward release', async function () {
      await neuromint.connect(owner).releaseReward(user.address, 0);
      await expect(
        neuromint.connect(owner).releaseReward(user.address, 0)
      ).to.be.revertedWith('Reward already released');
    });
  });
});
