import { ethers } from 'hardhat';

async function main() {
  const NeuroMint = await ethers.getContractFactory('NeuroMint');
  const neuromint = await NeuroMint.deploy();
  await neuromint.waitForDeployment();

  const address = await neuromint.getAddress();
  console.log(`NeuroMint deployed to: ${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
