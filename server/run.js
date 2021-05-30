var Web3 = require("web3");
var web3 = new Web3(Web3.givenProvider || "https://eth-testnet.coincircle.com");
// var web3 = new Web3(Web3.givenProvider || "ws://localhost:8546");
const contractAddresses = require("./smart contracts/contractAddresses.js");

// ABIs
const abi_DAI = require("./smart contracts/abi/abiDAI.json"); // mkr DAI abi
const abi_DAI_dsrmanager = require("./smart contracts/abi/abiDAI_dsrmanager.json"); // DAI dsr manager https://ropsten.etherscan.io/address/0x74ddba71e98d26ceb071a7f3287260eda8daa045#code
const abi_cDAI = require("./smart contracts/abi/abiCDAI.json"); // compound finance cDAI abi
const abi_storage = require("./smart contracts/abi/abiStorage.json");

const Dai_abi = require("./smart contracts/abi/DAI.json"); // Dai.abi
const Pot_abi = require("./smart contracts/abi/Pot.json"); // Dai.abi
const mycontract_abi = require("./smart contracts/abi/mycontractabi.json"); // mycontractabi.json

const init = (message) => {
  console.log("Initializing... ", message);
};

async function loadContract(abi, address) {
  // return await window.web3.eth.Contract("ABI", "ContractAddress");
  const loadedContract = new web3.eth.Contract(abi, address);

  // [
  //   { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
  //   {
  //     "inputs": [],
  //     "name": "decrement",
  //     "outputs": [],
  //     "stateMutability": "nonpayable",
  //     "type": "function"
  //   },
  //   {
  //     "inputs": [],
  //     "name": "getNumber",
  //     "outputs": [
  //       { "internalType": "uint256", "name": "", "type": "uint256" }
  //     ],
  //     "stateMutability": "view",
  //     "type": "function"
  //   },
  //   {
  //     "inputs": [],
  //     "name": "increment",
  //     "outputs": [],
  //     "stateMutability": "nonpayable",
  //     "type": "function"
  //   },
  //   {
  //     "inputs": [],
  //     "name": "number",
  //     "outputs": [
  //       { "internalType": "uint256", "name": "", "type": "uint256" }
  //     ],
  //     "stateMutability": "view",
  //     "type": "function"
  //   },
  //   {
  //     "inputs": [
  //       { "internalType": "uint256", "name": "num", "type": "uint256" }
  //     ],
  //     "name": "setNumber",
  //     "outputs": [],
  //     "stateMutability": "nonpayable",
  //     "type": "function"
  //   }
  // ],
  // "0xde9CB7696cE76513F1b34bd91589517989A63C1D"

  // console.log(loadedContract);
  return loadedContract;
}

async function callContractMethod(contract, methodName) {
  // const ourData = await contract.methods.getNumber().call();

  const methodStr = `contract.methods.${methodName}().call()`;
  const ourData = await eval(methodStr);
  return ourData;
}

const run = async () => {
  init();
  // init(contractAddresses);
  // console.log(web3);

  // getStorageVal();
  getCompoundAPY();
  getDsrAPY();
  getRatesArray();

  getLast128Blocks();
};

async function getStorageVal() {
  const contract = await loadContract(
    abi_storage,
    contractAddresses.storage_ropsten
  );
  // console.log("contract: ", contract);
  // console.log("contract: ", contract.methods);

  const outputData = await callContractMethod(contract, "getNumber");
  console.log("Storage Ethereum contract method output: ", outputData);
}

async function getCompoundAPY() {
  const ethMantissa = 1e18;
  const blocksPerDay = 6570; // 13.15 seconds per block
  const daysPerYear = 365;

  const cToken = await loadContract(abi_cDAI, contractAddresses.cdai_ropsten);
  const supplyRatePerBlock = await cToken.methods.supplyRatePerBlock().call();
  const borrowRatePerBlock = await cToken.methods.borrowRatePerBlock().call();
  console.log(
    `Compound Finance - Borrow APY per BLOCK ${borrowRatePerBlock} %`
  );

  const supplyApy =
    (Math.pow(
      (supplyRatePerBlock / ethMantissa) * blocksPerDay + 1,
      daysPerYear
    ) -
      1) *
    100;
  const borrowApy =
    (Math.pow(
      (borrowRatePerBlock / ethMantissa) * blocksPerDay + 1,
      daysPerYear
    ) -
      1) *
    100;
  // console.log(`Supply APY for ETH ${supplyApy} %`);
  console.log(`Compound Finance - Borrow APY for ETH ${borrowApy} %`);

  // Borrow APY for ETH 14.61884588590796 %
  // Borrow APY for ETH 14.618340068904079 %
  // Borrow APY for ETH 14.618642264677838 %
  return borrowApy;
}

async function getDsrAPY() {
  console.log("\ngetDsrAPY ran...");

  const contract = await loadContract(Pot_abi, contractAddresses.dsr_pot);
  // console.log("contract: ", contract);
  // console.log("contract methods: ", contract.methods);

  // var outputData = await callContractMethod(contract, "dsr");

  var response = await callContractMethod(contract, "dsr");
  // console.log("raw dsr response: ", response);

  var dsrPerSecond = response / 10 ** 27;
  var dsrAPY = dsrPerSecond ** (60 * 60 * 24 * 365);
  console.log(`dsr APY for ETH ${dsrAPY} %`);

  var outputData = dsrAPY;
  // console.log("dsr contract method output: ", outputData);
  return outputData;
}

async function getRatesArray() {
  console.log("\ngetRates ran...");

  const contract = await loadContract(
    mycontract_abi,
    contractAddresses.mycontract
  );
  // console.log("contract: ", contract);
  console.log("contract methods: ", contract.methods);

  // var outputData = await callContractMethod(contract, "dsr");
  var response = await callContractMethod(contract, "getCompound");
  console.log("Compound response: ", response);

  var response = await callContractMethod(contract, "getRates");
  console.log("AB contract response: ", response);

  var getRatesArray = response; // [Compound Finance, DSR, store.number()]

  var dsrPerSecond = getRatesArray[1] / 10 ** 27;
  var dsrAPY = dsrPerSecond ** (60 * 60 * 24 * 365);
  console.log(`AB Smart Contract - getRatesArray dsr APY for ETH ${dsrAPY} %`);

  // var outputData = dsrAPY;
  outputData = response;
  return outputData;
}

async function getLast128Blocks() {
  // var blockNumber = 10338987;
  var blockNumber = await web3.eth.getBlockNumber();
  console.log(`\n Latest Block Height:  ${blockNumber}`);

  const cToken = await loadContract(abi_cDAI, contractAddresses.cdai_ropsten);
  const borrowRatePerBlock = await cToken.methods.borrowRatePerBlock().call();
  console.log(`\n Last 128 Blocks:  ${borrowRatePerBlock} %`);
}

module.exports.default = run();
