# DFIT

DeFi Interest Tracker

# Welcome to the DeFi Interest Tracker, also known as D.F.I.T.

![DFIT.png](https://github.com/Balex8888/BlockchainDFIT/blob/main/client/src/img/DFIT.png?raw=true)

# Technical Synopsis

- Uses Ethereum smart contract to query live data comparing interest rates across diferent DeFi Platforms
- Client built using React and DeFi Pulse's API for historical interest data
- Backend built using NodeJS with a Postgres SQL database, along with live data from smart contracts on Ethereum / Ropsten testnet
- Currently supports Compound Finance and DAI DSR, with future plans to add smart contract support for Aave and dYdX

Preview of the Graphs of Tracking Historical Interest Rates across different smart contracts:
![GraphDFIT.png](https://github.com/Balex8888/BlockchainDFIT/blob/main/client/src/img/GraphDFIT.png?raw=true)

# Build

- DeFi Interest Tracker build insturctions:

```sh
// Requires nodejs and git
//   To install git see https://git-scm.com/downloads
//   To install nodejs see https://nodejs.org/en/download/

git clone https://github.com/Balex8888/BlockchainDFIT.git
npm install
```

- Switch into the client directory, install the dependencies before running the production build. Wait as React to bundles production code.

```
cd client
npm install
npm run build
```

- Switch to the server directory and install the dependencies

```
cd ../server
npm install
```

- While within the server directory start the server, and open your browser to localhost:3001 begin using the app

```
// Quick Start
npm start

// Manual alternative, Start server using
npm run dev
// Then open your browser to localhost:3001 to see the app
http://localhost:3001/
```

# Usage Instructions

- When the server is running, live blockchain data will be pulled from Ethereum's relevant smart contracts
- The top graph shows historical interest rates over a long period of time
- The bottom graph shows the most recent 128 blocks on the Ethereum network, and displays

### Todos

Possible future features include:

- Adding more platforms to compare interest rates on
- Adding options to select more specific timeframes
