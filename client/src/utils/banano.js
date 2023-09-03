import bananojs from "@bananocoin/bananojs";
import config from "../config.js";
import crypto from "crypto";
import { floor } from "./utils.js";

const REPRESENTATIVE = `ban_1ka1ium4pfue3uxtntqsrib8mumxgazsjf58gidh1xeo5te3whsq8z476goo`;
bananojs.setBananodeApiUrl("https://kaliumapi.appditto.com/api");

/**
 * Generate a new random banano account
 * @return {Object} { address, seed, publicKey, privateKey }
 */
export const generateRandomWallet = async () => {
  const seed = crypto.randomBytes(32).toString("hex");
  const privateKey = bananojs.getPrivateKey(seed, 0);
  const publicKey = await bananojs.getPublicKey(privateKey);
  const address = bananojs.getBananoAccount(publicKey);
  return { address, seed, publicKey, privateKey };
};

/**
 * Get address from seed at index 0
 * @param {string} seed
 * @return {Promise} address
 */
export const getAddressFromSeed = async (seed) => {
  const privateKey = bananojs.getPrivateKey(seed, 0);
  const publicKey = await bananojs.getPublicKey(privateKey);
  return bananojs.getBananoAccount(publicKey);
};

/**
 * Process receivable transactions for seed at index 0
 * @param {string} seed
 * @return {Promise} success
 */
export const processPending = async (seed) => {
  try {
    await bananojs.receiveBananoDepositsForSeed(seed, 0, REPRESENTATIVE);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

/**
 * Send bananos from user wallet to main wallet
 * @param {string} userSeed
 * @param {string} amountToSendRaw
 * @return {Promise}
 */
const sendBananoToProxy = async (seed, amountRaw) => {
  return new Promise((resolve, reject) => {
    bananojs.sendAmountToBananoAccount(
      seed,
      0,
      config.BANANO_SEEDS.MAIN_ADDRESS,
      amountRaw,
      resolve,
      reject
    );
  });
};

/**
 * Send bananos from main wallet to user wallet
 * @param {string} userAddress
 * @param {string} amountToSendRaw
 * @return {Promise}
 */
export const sendBananoFromProxy = async (address, amountRaw) => {
  return new Promise((resolve, reject) => {
    bananojs.sendAmountToBananoAccount(
      config.BANANO_SEEDS.MAIN_SEED,
      0,
      address,
      amountRaw,
      resolve,
      reject
    );
  });
};

/**
 * Returns the raw balance of main wallet (ban_1casino1)
 * @return {Promise} accountBalanceRaw
 */
export const getProxyBalance = async () => {
  return await bananojs.getAccountBalanceRaw(config.BANANO_SEEDS.MAIN_ADDRESS);
};

/**
 * Convert bananos from raw to decimal
 * @param {string} bananosRaw
 * @return {number} bananosDecimal
 */
export const getAmountFromRaw = (amountRaw) => {
  const amount = bananojs.getBananoPartsAsDecimal(
    bananojs.getBananoPartsFromRaw(amountRaw)
  );
  return amount;
};

/**
 * Convert bananos from decimal to raw
 * @param {string} bananosDecimal
 * @return {number} bananosRaw
 */
export const getRawFromAmount = (amount) => {
  const raw = bananojs.getRawStrFromBananoStr(amount);
  return raw;
};

/**
 * Claim bananos in seed and send to main wallet (ban_1casino1)
 * @param {string} seed
 * @return {Promise} amountClaimed
 */
export const claimDeposit = async (seed) => {
  const privateKey = bananojs.getPrivateKey(seed, 0);
  const publicKey = await bananojs.getPublicKey(privateKey);
  const address = bananojs.getBananoAccount(publicKey);

  const balanceRaw = await bananojs.getAccountBalanceRaw(address);
  const amount = parseFloat(getAmountFromRaw(balanceRaw));

  const amountToAward = floor(amount);

  if (!amountToAward || amountToAward < 0.01) {
    return null;
  }

  try {
    const sent = await sendBananoToProxy(seed, balanceRaw);
    if (!sent) throw new Error("Failed to send banano to proxy.");

    return amountToAward;
  } catch (e) {
    return null;
  }
};

export const receiveProxyBalance = (seed) => {
  setTimeout(() => {
    processPending(config.BANANO_SEEDS.MAIN_SEED);
  }, 5000);
};

/**
 * Check if address is unopened (no history)
 * @param {string} address
 * @return {Promise} isUnopened
 */
export const isUnopened = async (address) => {
  let account_history = await bananojs.getAccountHistory(address, -1);
  if (account_history.history == "") {
    return true;
  }
  return false;
};
