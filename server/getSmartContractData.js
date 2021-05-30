async function loadContract() {
  return await window.web3.eth.Contract("ABI", "ContractAddress");
  return await window.web3.eth.Contract(
    [
      { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
      {
        "inputs": [],
        "name": "decrement",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getNumber",
        "outputs": [
          { "internalType": "uint256", "name": "", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "increment",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "number",
        "outputs": [
          { "internalType": "uint256", "name": "", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "num", "type": "uint256" }
        ],
        "name": "setNumber",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ],
    "0xde9CB7696cE76513F1b34bd91589517989A63C1D"
  );
}

async function getData() {
  const ourData = await window.contract.methods.getNumber().call();
}
