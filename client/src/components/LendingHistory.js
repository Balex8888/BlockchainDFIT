import React, { useState, useEffect } from "react";
import useInterval from "./useInterval"; // Custom useInterval react hook
import axios from "axios";

import seedData from "../data/seedData1Week";
import seedDataAll from "../data/seedDataAllWeeks";
import config from "./config";
import HistoricalGraph from "./HistoricalGraph";
const localhostUrl = `http://localhost:3001`;

const LendingHistory = (props) => {
  const [data, setData] = useState("Loading Data...");
  const [isSeedDataLoaded, setIsSeedDataLoaded] = useState(false);
  // const [seedBlockData, setSeedBlockData] = useState();
  const [isBlockchainLoaded, setIsBlockchainLoaded] = useState(false);
  const [blockchainData, setBlockchainData] = useState([null, null, null, null]);
  const [currentBlockData, setCurrentBlockData] = useState([0, 0, 0, 0]);
  // const [currentBlockData, setCurrentBlockData] = useState([null, null, null, null]);

  const [CompoundBlockTuples, setCompoundBlockTuples] = useState([[null, null]]);
  const [DsrBlockTuples, setDsrBlockTuples] = useState([[null, null]]);

  // const [CompoundBlockTuples, setCompoundBlockTuples] = useState([
  //   [1622550502000, 14.619947024405832],
  //   [1622550469000, 14.619947024405832],
  //   [1622550407000, 14.619947024405832]
  // ]);
  // const [DsrBlockTuples, setDsrBlockTuples] = useState([
  //   [1622550502000, 1.0599999976112906],
  //   [1622550469000, 1.0599999976112906],
  //   [1622550407000, 1.0599999976112906]
  // ]);

  useEffect(() => {
    const apiUrlManualParams = `https://data-api.defipulse.com/api/v1/defipulse/api/getLendingHistory`; // Without Params
    // const apiUrl = `https://data-api.defipulse.com/api/v1/defipulse/api/getLendingHistory?api-key=0a76fcf26c309d5259511fb925a95cd204c0b3527a011e121c95df8ee278&period=1w&resolution=hours`;   // Period: 1w -- Resolution: Hours
    // const apiUrl = `https://data-api.defipulse.com/api/v1/defipulse/api/getLendingHistory?api-key=0a76fcf26c309d5259511fb925a95cd204c0b3527a011e121c95df8ee278&period=all&resolution=hours`; // Period: All -- Resolution: Hours

    if (!isSeedDataLoaded) {
      console.log("Need to load seed data..");
      const params = {
        // "api-key": config.pulseApiKey, // Hidden Key in config.. can use limited free dummy one below
        "api-key": "5ca85a649370447728830a5bffb98ca05d7468b0fb23e82d12e2a3a54a0d",
        // "period": "all",
        // "period": "1y",
        // "period": "3m",
        "period": "1m",
        "resolution": "hours"
      };
      // axios.get(apiUrl)

      ///// Uncomment to use real data, API Key 87% used for the month
      axios
        .get(apiUrlManualParams, {
          "params": params
        })
        .then((res) => {
          console.log("API Get done");
          const resData = res.data;
          const firstElement = res.data[0];

          console.log("res.data OUTPUT: ", resData);
          console.log("FIRST ELEMENT: ", firstElement);
          // setData("Get Request Done");
          setData(resData);
          setIsSeedDataLoaded(true);
        })
        .catch((error) => {
          return error;
        });
      ///// Uncomment to use real data

      // setData(seedData);
      // setData(seedDataAll);
      setIsSeedDataLoaded(true);
    } else {
      console.log("Seed Data done loading..");
    }

    if (!isBlockchainLoaded) {
      // Getting First Block
      axios
        .get(`${localhostUrl}/getcurrentblockfromblockchain`)
        .then((res) => {
          var currentBlock = res.data;
          setCurrentBlockData(currentBlock);
        })
        .catch((error) => {
          return error;
        });

      // Update Recent Blocks // Moved live update functionality / seeding to backend instead!
      // axios
      //   .get(`${localhostUrl}/updaterecentblocks`)
      //   .then((res) => {
      //     let resData = res.data;
      //   })
      //   .catch((error) => {
      //     return error;
      //   });
      axios
        .get(`${localhostUrl}/getrecenttuplescompound`)
        .then((res) => {
          let data = res.data;
          console.log(`Frontend JSON for /getrecenttuplescompound --- : ${JSON.stringify(data)}`);
          setCompoundBlockTuples(data);
        })
        .catch((error) => {
          return error;
        });
      axios
        .get(`${localhostUrl}/getrecenttuplesdsr`)
        .then((res) => {
          let data = res.data;
          console.log(`Frontend JSON for /getrecenttuplesdsr --- : ${JSON.stringify(data)}`);
          setDsrBlockTuples(data);
          setIsBlockchainLoaded(true);
        })
        .catch((error) => {
          return error;
        });
    }
  }, [isSeedDataLoaded, isBlockchainLoaded]); // Only Run use effect when Seed / Blockchain data isnt loaded
  // }, [data]);
  // }, []);
  // });

  // Pulling in live block data from my smart contract
  // Example: [compound, dsr, unixtime, block]
  // [14.619947024405832, 1.0599999976112906, 1622540958, 10351693]
  useInterval(() => {
    console.log("In use interval.. Repeat in: 3000");

    // Updated to no longer trigger db write, server automatically updates and
    axios
      .get(`${localhostUrl}/getcurrentblockfromdb`)
      .then((res) => {
        var currentBlock = res.data;
        // console.log("#### Compound Tuple State Before Update: ", CompoundBlockTuples);
        let currentCompound = [currentBlock[2], currentBlock[0]]; // unixtime[2] compound[0]
        setCompoundBlockTuples(CompoundBlockTuples.concat(currentCompound));
        let currentDsr = [currentBlock[2], currentBlock[1]]; // unixtime[2] dsr[1]
        setDsrBlockTuples(DsrBlockTuples.concat(currentDsr));
        // console.log("#### Compound Tuple State After Before Update: ", CompoundBlockTuples);

        // currentBlock[2] = JSON.stringify(new Date(currentBlock[2]));
        setCurrentBlockData(currentBlock);
      })
      .catch((error) => {
        return error;
      });
  }, 5000);

  return (
    <div>
      <div className="col-12"></div>
      <HistoricalGraph data={data} currentBlockData={currentBlockData} DsrBlockTuples={DsrBlockTuples} CompoundBlockTuples={CompoundBlockTuples}></HistoricalGraph>

      <h1>Live Blockchain Rates:</h1>
      <h2>Dai DSR: {currentBlockData[1].toFixed(2)}% </h2>
      <h2>Compound: {currentBlockData[0].toFixed(2)}% </h2>
      {/* <h2>Dai DSR: {currentBlockData[1]}% </h2>
      <h2>Compound: {currentBlockData[0]}% </h2> */}
      {/* <p1>current block: {currentBlockData[3]} </p1> */}
      <p1>current block: {currentBlockData[3]} </p1>
      {/* <p1>at time: {JSON.stringify(new Date(currentBlockData[2]))}</p1> */}

      {/* <p1>{currentBlockData[1].toFixed(2)}%</p1> */}
      {/* <p1>{currentBlockData[0].toFixed(2)}%</p1> */}
      {/* <p1>
        Compound: {currentBlockData[0]}
        {"\n"}
        DSR: {currentBlockData[1]}
        {"\n"}
      </p1> */}

      {/* <p1>
        current time: {JSON.stringify(new Date(currentBlockData[2]))}
        current block: {currentBlockData[3]}
      </p1> */}
      {/* <p1>
        Data Loaded?: {JSON.stringify(isSeedDataLoaded)}
        Blockchain Loaded?: {JSON.stringify(isBlockchainLoaded)}
      </p1> */}
    </div>
  );
};

export default LendingHistory;
