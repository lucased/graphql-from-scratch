import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.ALCHEMY_KEY
const proivder = new ethers.providers.AlchemyProvider("mainnet", API_KEY);

export const getBalance = async (address) => {
  const balanceHex = await proivder.getBalance(address);
  return ethers.utils.formatEther(balanceHex);
};

export const getTransactionCount = async (address) => {
  return proivder.getTransactionCount(address);
};
