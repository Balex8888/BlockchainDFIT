import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";

const HistoricalGraph = (props) => {
  var [timestamps, setTimestamps] = useState();
  var [oneTimestamp, setOneTimestamp] = useState();
  var [lendRates, setLendRates] = useState();

  useEffect(() => {
    console.log("HIGHCHARTS - ", Highcharts);
    console.log("HIST GRAPH - props.data: ", props.data);
    setOneTimestamp(props.data[0]["timestamp"]);
  });

  return (
    <div>
      {/* <p>Historical Graph {props.data}</p> */}
      <p>One Timestamp: {oneTimestamp}</p>
      <p>--- End of Graph --- </p>
    </div>
  );
};

export default HistoricalGraph;
