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
  if (block !== undefined) {
    var methodStr = `contract.methods.${methodName}().call(null, ${block})`;
    // console.log(`Executing method ${methodName} on block ${block}..`);
  } else {
    var methodStr = `contract.methods.${methodName}().call()`;
  }
  // const ourData = await contract.methods.getRates().call();   // Standard contract call for refernce
  const ourData = await eval(methodStr); // Running the custom contract call
  return ourData;
}

async function getLatestBlockNumber() {
  const contract = await loadContract(mycontract_abi, contractAddresses.mycontract);

  var latestBlockNumber = await web3.eth.getBlockNumber();
  console.log("Latest Block Number is ###: ", latestBlockNumber);
  return latestBlockNumber;
}

async function getCompoundAPY() {
  // const ethMantissa = 1e18;
  // const blocksPerDay = 6570; // 13.15 seconds per block
  // const daysPerYear = 365;

  const cToken = await loadContract(abi_cDAI, contractAddresses.cdai_ropsten);
  const borrowRatePerBlock = await cToken.methods.borrowRatePerBlock().call();
  console.log(`Compound Finance - Borrow raw data per BLOCK ${borrowRatePerBlock} %`);

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
  const contract = await loadContract(mycontract_abi, contractAddresses.mycontract);

  // console.log("contract methods: ", contract.methods);
  var newestBlockNumber = await web3.eth.getBlockNumber();

  if (optionalBlockNumber) {
    var tempData = await callContractMethod(contract, "getRates", optionalBlockNumber);
    var thisBlock = await web3.eth.getBlock(optionalBlockNumber);
    var timestamp = thisBlock.timestamp;
    var blockNumber = optionalBlockNumber;
    console.log(`\ngetRatesArray OPTIONAL Block:  ${optionalBlockNumber}, unix timestamp: ${timestamp}`);
  } else {
    var tempData = await callContractMethod(contract, "getRates", newestBlockNumber);
    var thisBlock = await web3.eth.getBlock(newestBlockNumber);
    var timestamp = thisBlock.timestamp;
    var blockNumber = newestBlockNumber;
    console.log(`\ngetRatesArray NEWEST Block:  ${newestBlockNumber}, unix timestamp: ${timestamp}`);
  }
  var compoundApy = (Math.pow((tempData[0] / 1e18) * 6570 + 1, 365) - 1) * 100; // Converting per block to APY
  var dsrAPY = (tempData[1] / 10 ** 27) ** (60 * 60 * 24 * 365);
  var tripletArray = [compoundApy, dsrAPY, timestamp, blockNumber]; // Compound - DSR - Timestamp - Blocknumber
  // console.log('getRatesArray: ', tripletArray)
  return tripletArray;
}

async function getLast128Blocks(howManyBlocks) {
  if (howManyBlocks >= 127) {
    console.log("Reducing howManyBlocks count to 127.."); // Nodes only support last 128 blocks
    howManyBlocks = 127;
  }
  var blockAmount = howManyBlocks || 127;
  // var blockNumber = 10338987;
  var newestBlockNumber = await web3.eth.getBlockNumber();
  var oldestBlockNumber = newestBlockNumber - blockAmount;

  var thisBlock = await web3.eth.getBlock(newestBlockNumber);
  var timestamp = thisBlock.timestamp;

  console.log(`\n Latest Block Height:  ${newestBlockNumber}, unix timestamp: ${timestamp}`);

  //// My Contract
  const myContract = await loadContract(mycontract_abi, contractAddresses.mycontract);

  // ////// DSR individually //// Async Method works
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

  // ////// Compound Finance individually //// Async Method works
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

  var recentBlocksData = [];
  var count = 0;
  for (let i = oldestBlockNumber; i <= newestBlockNumber; i++) {
    var thisBlock = await web3.eth.getBlock(i);
    var timestamp = thisBlock.timestamp;
    var tempData = await callContractMethod(myContract, "getRates", i);
    // console.log('TEMP DATA: ', tempData)
    var compoundApy = (Math.pow((tempData[0] / 1e18) * 6570 + 1, 365) - 1) * 100; // Converting per block to APY
    var dsrAPY = (tempData[1] / 10 ** 27) ** (60 * 60 * 24 * 365);
    var tripletArray;
    tripletArray = [compoundApy, dsrAPY, timestamp, i]; // Compound - DSR - Timestamp - Block
    count++;
    console.log(`${count} MyContract getLatestBlocks --- tripletArray: ${tripletArray}`);
    recentBlocksData.push(tripletArray);
  } ///// Sync

  /// Outer Promise.all attempt
  // Promise.allSettled(recentBlocksData).then(triplets => {
  //   triplets.forEach(item => {
  //         console.log('item: ', item)
  //         // Promise.allSettled(item).then(values => {
  //         //   console.log(`Triplets individual: ${values}`)
  //         // }).catch(error => console.log('Promises.all inner failed', error))
  //   })
  // }).catch(error => console.log('Promises.all outer failed', error))

  //// Inner Promise.all attempt
  //   recentBlocksData.forEach(triplet => {
  //     Promise.allSettled(triplet).then(values => {
  //       // console.log(`Triplets individual: ${values}`)
  //       // console.log(`Triplets individual status: ${values[0]['status']}`)
  //       // console.log(`Triplets individual value: ${values[0]['value']}`)
  //       // //   console.log(`Triplets: ${triplets}`)
  //       //   console.log('typeof value: ', typeof values[0])
  //   }).catch(error => console.log('Promises.all inner failed', error))

  // })

  // setTimeout(() => {
  //   console.log(
  //     // `\n ------ Historical Block Data Array: ${dsrHistoricalBlockData}`,
  //     // `\n ------ Historical Block Data Array: ${compoundHistoricalBlockData}`
  //     `\n ------ Historical Block Data Array: ${recentBlocksData}`
  //   );
  // }, 1000);

  console.log("recentBlocksData: ", recentBlocksData);
  return recentBlocksData;
}

const run = async () => {
  init();

  getCompoundAPY();
  getDsrAPY();
  getRatesArray();

  getLast128Blocks(128);
};

// module.exports.default = run();
module.exports = { run, getLatestBlockNumber, getCompoundAPY, getDsrAPY, getRatesArray, getLast128Blocks };
