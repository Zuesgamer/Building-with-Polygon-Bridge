require("dotenv").config();
const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json");
const contractAddress = "0xE34058D51A6cF5556Cc361F7AA20F578BB847306";
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

async function mintNFT(tokenURI) {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest");
  const gasPrice = await web3.eth.getGasPrice();
  // Manually set a higher gas price if needed
  const increasedGasPrice = web3.utils.toBN(gasPrice).mul(web3.utils.toBN(150)).div(web3.utils.toBN(100)); 

  const tx = {
    from: PUBLIC_KEY,
    to: contractAddress,
    nonce: nonce,
    gas: 600000, // Adjust based on contract requirements
    gasPrice: increasedGasPrice.toString(),
    data: nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI(),
  };

  try {
    const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
    const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log("Transaction hash:", txReceipt.transactionHash);
  } catch (err) {
    console.error("Error when submitting the transaction:", err);
  }
}

mintNFT("https://gateway.pinata.cloud/ipfs/QmQX2tK3AYNPyEiaFxf6fX97QmoTfXxsLhHmaKcqvAdUoq");
