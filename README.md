# Building-with-Polygon-Bridge

This repository contains a comprehensive guide and scripts for creating, deploying, and managing an NFT collection using DALL-E 2 or Midjourney for image generation, IPFS for storage, and smart contracts on the Goerli Ethereum Testnet and Polygon Mumbai Testnet. Follow the steps below to set up and deploy your NFT collection.

## Table of Contents

1. [Generate Collection](#generate-collection)
2. [Store Items on IPFS](#store-items-on-ipfs)
3. [Deploy ERC721 or ERC1155 Contract](#deploy-erc721-or-erc1155-contract)
4. [Map Collection on Polygon](#map-collection-on-polygon)
5. [Mint NFTs](#mint-nfts)
6. [Transfer NFTs to Polygon](#transfer-nfts-to-polygon)
7. [Testing](#testing)
8. [Scripts](#scripts)

## Generate Collection

1. **Generate a 5-item collection using DALL-E 2 or Midjourney**:
   - Create your images using DALL-E 2 or Midjourney.
   - Save each image with a descriptive filename.

## Store Items on IPFS

1. **Store items on IPFS using Pinata.cloud**:
   - Sign up for an account on [Pinata.cloud](https://pinata.cloud).
   - Upload your images to Pinata and note down the IPFS hashes for each image.

## Deploy ERC721 or ERC1155 Contract

1. **Deploy an ERC721 or ERC1155 contract to the Goerli Ethereum Testnet**:
   - Use Hardhat for deploying your smart contract.
   - Create a function named `promptDescription` in your contract that returns the prompt used to generate each image.

Example contract snippet:
```solidity
function promptDescription(uint256 tokenId) public view returns (string memory) {
    return prompts[tokenId];
}
```

2. **Map your NFT Collection using Polygon network token mapper** (optional but recommended for visualization).

## Mint NFTs

1. **Write a Hardhat script to batch mint all NFTs**:
   - Utilize `ERC721A` for optimal batch minting.

Example script:
```javascript
async function main() {
  const [deployer] = await ethers.getSigners();
  const NFTContract = await ethers.getContractFactory("YourNFTContract");
  const nft = await NFTContract.deploy();
  await nft.deployed();

  // Mint NFTs in a batch
  const tokenURIs = [
    "ipfs://hash1",
    "ipfs://hash2",
    "ipfs://hash3",
    "ipfs://hash4",
    "ipfs://hash5"
  ];

  await nft.batchMint(deployer.address, tokenURIs);
  console.log("NFTs minted successfully");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

## Transfer NFTs to Polygon

1. **Write a Hardhat script to batch transfer all NFTs from Ethereum to Polygon Mumbai using the FxPortal Bridge**:
   - Approve the NFTs for transfer.
   - Deposit the NFTs to the bridge.

Example transfer script:
```javascript
async function main() {
  const [deployer] = await ethers.getSigners();
  const NFTContract = await ethers.getContractFactory("YourNFTContract");
  const nft = NFTContract.attach("your_contract_address");

  const tokenIds = [1, 2, 3, 4, 5];
  const fxPortalBridgeAddress = "fx_portal_bridge_address";

  // Approve the bridge to transfer your NFTs
  for (const tokenId of tokenIds) {
    await nft.approve(fxPortalBridgeAddress, tokenId);
  }

  // Deposit NFTs to the bridge
  for (const tokenId of tokenIds) {
    await nft.depositToPolygon(fxPortalBridgeAddress, deployer.address, tokenId);
  }

  console.log("NFTs transferred to Polygon successfully");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

## Testing

1. **Test `balanceOf` on Mumbai**:
   - Ensure that the NFTs have been successfully transferred to the Polygon Mumbai network.
   - Check the balance of the recipient address on the Mumbai network.

Example test:
```javascript
const recipientAddress = "recipient_address";
const balance = await nft.balanceOf(recipientAddress);
console.log(`Balance on Mumbai: ${balance.toString()}`);
```

## Scripts

- **`mint-nfts.js`**: Script for batch minting NFTs on the Goerli Ethereum Testnet.
- **`transfer-nfts.js`**: Script for batch transferring NFTs to Polygon Mumbai using the FxPortal Bridge.
- **`check-balance.js`**: Script to check the balance of NFTs on the Polygon Mumbai network.

Ensure you have the necessary environment variables and configurations in place for deploying and interacting with your smart contracts. Happy minting and bridging!
