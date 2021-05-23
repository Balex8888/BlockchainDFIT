import React, { useState, useEffect } from "react";
import axios from "axios";

import seedData from "../data/seedData1Week";
import config from "./config";
import HistoricalGraph from "./HistoricalGraph";

const LendingHistory = (props) => {
  var [data, setData] = useState("Loading Data...");
  var [timestamps, setTimestamps] = useState();
  var [oneTimestamp, setOneTimestamp] = useState();
  var [lendRates, setLendRates] = useState();

  useEffect(() => {
    const apiUrl = "https://api.github.com/users/hacktivist123/repos";
    // const apiUrl = `https://data-api.defipulse.com/api/v1/defipulse/api/getLendingHistory?api-key=0a76fcf26c309d5259511fb925a95cd204c0b3527a011e121c95df8ee278&period=1w&resolutio"n=hours`;
    // const apiUrl =
    //   `https://data-api.defipulse.com/api/v1/defipulse/api/getLendingHistory`;
    const params = {
      "api-key": config.pulseApiKey,
      "period": "1w",
      "resolution": "hours"
    };
    axios
      .get(apiUrl)
      .then((res) => {
        console.log("API Get done");
        const resData = res.data;
        const firstElement = res.data[0];

        console.log("OUTPUT: ", resData);
        console.log("FIRST ELEMENT: ", firstElement);
        // setData("Get Request Done");
      })
      .catch((error) => {
        return error;
      });
    setData(seedData);
    // setTimestamps(JSON.stringify(seedData[0]));
    // setLendRates(JSON.stringify(seedData[0]["lend_rates"]));
    // setOneTimestamp(JSON.stringify(seedData[0]["timestamp"]));
  });

  return (
    <div>
      <HistoricalGraph data={data}></HistoricalGraph>
      <h1>Lending History</h1>
      {/* <p1> GET Requests Data: {data}</p1> */}
      <p1> Data Timestamp: {oneTimestamp}</p1>
      <p1> Data Timestamp: {timestamps}</p1>
      <p1> Lend Rates: {lendRates}</p1>
    </div>
  );
};

export default LendingHistory;
