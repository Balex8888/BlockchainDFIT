var Web3 = require("web3");
var web3 = new Web3(Web3.givenProvider || "https://eth-testnet.coincircle.com");
// var web3 = new Web3(Web3.givenProvider || "ws://localhost:8546");
const contractAddresses = require("./smart contracts/contractAddresses.js");

// ABIs
const abi_cDAI = require("./smart contracts/abi/abiCDAI.json"); // compound finance cDAI abi
const Pot_abi = require("./smart contracts/abi/Pot.json"); // Dai.abi
const mycontract_abi = require("./smart contracts/abi/mycontractabi.json"); // mycontractabi.json


const init = (message) => {
  console.log("Initializing... ", message);
};

async function loadContract(abi, address) {
  const loadedContract = new web3.eth.Contract(abi, address);
  // console.log(loadedContract);

  return loadedContract;
}

async function callContractMethod(contract, methodName, block) {
  // const ourData = await contract.methods.getNumber().call();
  if (block !== undefined) {
    var methodStr = `contract.methods.${methodName}().call(null, ${block})`;
    console.log(`Executing method ${methodName} on block ${block}..`);
  } else {
    var methodStr = `contract.methods.${methodName}().call()`;
  }
  const ourData = await eval(methodStr);
  return ourData;
}


async function getCompoundAPY() {
  // const ethMantissa = 1e18;
  // const blocksPerDay = 6570; // 13.15 seconds per block
  // const daysPerYear = 365;

  const cToken = await loadContract(abi_cDAI, contractAddresses.cdai_ropsten);
  const borrowRatePerBlock = await cToken.methods.borrowRatePerBlock().call();
  console.log(
    `Compound Finance - Borrow raw data per BLOCK ${borrowRatePerBlock} %`
  );

  // const compoundAPY = (Math.pow((borrowRatePerBlock / ethMantissa) * blocksPerDay + 1, daysPerYear) - 1) * 100;
  const compoundAPY = (Math.pow((borrowRatePerBlock / 1e18) * 6570 + 1, 365) - 1) * 100;
  console.log(`Compound Finance - Borrow APY for ETH ${compoundAPY} %`);

  // Borrow APY for ETH 14.61884588590796 %
  // Borrow APY for ETH 14.618340068904079 %
  // Borrow APY for ETH 14.618642264677838 %
  return compoundAPY;
}

async function getDsrAPY() {
  console.log("\ngetDsrAPY ran...");

  const contract = await loadContract(Pot_abi, contractAddresses.dsr_pot);
  // console.log("contract methods: ", contract.methods);

  var response = await callContractMethod(contract, "dsr");
  // console.log("raw dsr response: ", response);
  // var dsrPerSecond = response / 10 ** 27;
  // var dsrAPY = dsrPerSecond ** (60 * 60 * 24 * 365);

  
  var dsrAPY = (response / 10 ** 27) ** (60 * 60 * 24 * 365);
  console.log(`dsr APY for ETH ${dsrAPY} %`);
  return dsrAPY;
}

async function getRatesArray(optionalBlockNumber) {
  const contract = await loadContract(
    mycontract_abi,
    contractAddresses.mycontract
  );

  // console.log("contract methods: ", contract.methods);
  var newestBlockNumber = await web3.eth.getBlockNumber();  

  
  if (optionalBlockNumber) {
    var tempData = await callContractMethod(contract, "getRates", optionalBlockNumber);
    var thisBlock = await web3.eth.getBlock(optionalBlockNumber);
    var timestamp = thisBlock.timestamp;
    console.log(`\n getRatesArray OPTIONAL Block:  ${optionalBlockNumber}, unix timestamp: ${timestamp}`);
  } else {
    var tempData = await callContractMethod(contract, "getRates", newestBlockNumber);
    var thisBlock = await web3.eth.getBlock(newestBlockNumber);
    var timestamp = thisBlock.timestamp;
    console.log(`\n getRatesArray NEWEST Block:  ${newestBlockNumber}, unix timestamp: ${timestamp}`);

  }
    var compoundApy = (Math.pow((tempData[0] / 1e18) * 6570 + 1, 365) - 1) * 100; // Converting per block to APY
    var dsrAPY = (tempData[1] / 10 ** 27) ** (60 * 60 * 24 * 365);
    var tripletArray = [compoundApy, dsrAPY, timestamp]; // Compound - DSR - Timestamp
    console.log('AB getRates - tripletArray: ', tripletArray)
    return tripletArray;

}


async function getLast128Blocks(howManyBlocks) {
  var blockAmount = howManyBlocks || 127
  // var blockNumber = 10338987;
  var newestBlockNumber = await web3.eth.getBlockNumber();
  var oldestBlockNumber = newestBlockNumber - blockAmount;
  
  var thisBlock = await web3.eth.getBlock(newestBlockNumber);
  var timestamp = thisBlock.timestamp;

  console.log(
    `\n Latest Block Height:  ${newestBlockNumber}, unix timestamp: ${timestamp}`
  );

  //// My Contract
  const myContract = await loadContract(
    mycontract_abi,
    contractAddresses.mycontract
  );

  // ////// DSR //// Async Method works
  // var dsrHistoricalBlockData = [];
  // for (let i = oldestBlockNumber; i <= newestBlockNumber; i++) {
  //   var thisBlock = await web3.eth.getBlock(i);
  //   var timestamp = thisBlock.timestamp;
  //   var tempData = await callContractMethod(myContract, "getDsr", i);
  //   var dsrAPY = (tempData / 10 ** 27) ** (60 * 60 * 24 * 365);
  //   var tuple = [timestamp, dsrAPY];
  //   console.log('MyContract getDsr -------------------- Tuple: ', tuple)
    
  //   dsrHistoricalBlockData.push(tuple);
  // } 
  
  
  // ////// Compound Finance //// Async Method works
  // var compoundHistoricalBlockData = [];
  // for (let i = oldestBlockNumber; i <= newestBlockNumber; i++) {
  //   var thisBlock = await web3.eth.getBlock(i);
  //   var timestamp = thisBlock.timestamp;
  //   var tempData = await callContractMethod(myContract, "getCompound", i);
  //   var compoundApy = (Math.pow((tempData / 1e18) * 6570 + 1, 365) - 1) * 100; // Converting per block to APY
  //   var tuple = [timestamp, compoundApy];
  //   console.log('MyContract getCompund - Tuple: ', tuple)
  //   compoundHistoricalBlockData.push(tuple);
  // } //// Async Method works






  var getRatesHistoricalData = [];
  for (let i = oldestBlockNumber; i <= newestBlockNumber; i++) {
    var thisBlock = await web3.eth.getBlock(i);
    var timestamp = thisBlock.timestamp;
    var tempData = await callContractMethod(myContract, "getRates", i);
    // console.log('TEMP DATA: ', tempData)
    var compoundApy = (Math.pow((tempData[0] / 1e18) * 6570 + 1, 365) - 1) * 100; // Converting per block to APY
    var dsrAPY = (tempData[1] / 10 ** 27) ** (60 * 60 * 24 * 365);
    var tripletArray = [compoundApy, dsrAPY, timestamp]; // Compound - DSR - Timestamp
    console.log('MyContract getRates - tripletArray: ', tripletArray)
    getRatesHistoricalData.push(tripletArray);
  }

  setTimeout(() => {
    console.log(
      // `\n ------ Historical Block Data Array: ${dsrHistoricalBlockData}`,
      // `\n ------ Historical Block Data Array: ${compoundHistoricalBlockData}`
      `\n ------ Historical Block Data Array: ${getRatesHistoricalData}`
    );
  }, 1000);
}




const run = async () => {
  init();

  getCompoundAPY();
  getDsrAPY();
  getRatesArray();

  getLast128Blocks(3);
};

// module.exports.default = run();
module.exports = {run, getCompoundAPY, getDsrAPY, getRatesArray,  getLast128Blocks};