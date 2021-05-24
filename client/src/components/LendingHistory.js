import React, { useState, useEffect } from "react";
import axios from "axios";

import seedData from "../data/seedData1Week";
import seedDataAll from "../data/seedDataAllWeeks";
import config from "./config";
import HistoricalGraph from "./HistoricalGraph";

const LendingHistory = (props) => {
  const [data, setData] = useState("Loading Data...");
  const [timestamps, setTimestamps] = useState();
  const [oneTimestamp, setOneTimestamp] = useState();
  const [lendRates, setLendRates] = useState();

  useEffect(() => {
    // const apiUrl = `https://data-api.defipulse.com/api/v1/defipulse/api/getLendingHistory`;  // Without Params
    // const apiUrl = `https://data-api.defipulse.com/api/v1/defipulse/api/getLendingHistory?api-key=0a76fcf26c309d5259511fb925a95cd204c0b3527a011e121c95df8ee278&period=1w&resolution=hours`;   // Period: 1w -- Resolution: Hours
    const apiUrl = `https://data-api.defipulse.com/api/v1/defipulse/api/getLendingHistory?api-key=0a76fcf26c309d5259511fb925a95cd204c0b3527a011e121c95df8ee278&period=all&resolution=hours`; // Period: All -- Resolution: Hours

    const params = {
      "api-key": config.pulseApiKey,
      "period": "all",
      "resolution": "hours"
    };
    axios
      .get(apiUrl)
      // .get(apiUrl, {
      //   "params": params
      // })
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
    // setData(seedDataAll);
    // setTimestamps(JSON.stringify(seedData[0]));
    // setLendRates(JSON.stringify(seedData[0]["lend_rates"]));
    // setOneTimestamp(JSON.stringify(seedData[0]["timestamp"]));
  }, [data]);

  return (
    <div>
      <div className="col-12"></div>
      <HistoricalGraph data={data}></HistoricalGraph>

      <h1>Lending Rates:</h1>
      <p1>{lendRates}</p1>
      {/* <p1> GET Requests Data: {data}</p1> */}
    </div>
  );
};

export default LendingHistory;
