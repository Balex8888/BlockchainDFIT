import React, { useState, useEffect } from "react";
// import Highcharts from "highcharts";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import seedTuples from "../data/seedDataTuples";
import seedTuples2 from "../data/seedDataTuples2";

const HistoricalGraph = (props) => {
  // const [timestamps, setTimestamps] = useState();
  // const [oneTimestamp, setOneTimestamp] = useState();
  // const [lendRates, setLendRates] = useState();
  // const [xValues, setXValues] = useState();
  // const [yValues, setYValues] = useState();
  // const [tuples, setTuples] = useState();

  const mapXValues = (rawData) => {
    let arr = [];
    for (let i = 0; i < rawData.length; i++) {
      arr.push(rawData[i]["timestamp"]);
    }

    console.log("Map X Values Ran for timestamps..", arr);
    return arr;
  };

  const mapYValues = (rawData) => {
    let arr = [];
    for (let i = 0; i < rawData.length; i++) {
      var temp = { ...rawData[i]["lend_rates"] };
      arr.push(temp);
      // arr.push(rawData[i]["lend_rates"]);
    }

    console.log("Map YValues Ran..", arr);
    return arr;
  };
  const mapSpecific = (rawData, name) => {
    let arr = [];
    for (let i = 0; i < rawData.length; i++) {
      // arr.push(rawData[i]["lend_rates"][name]);
      console.log('#@# LEND RATES - No Name"]', rawData[i]["lend_rates"]);

      var temp = { ...rawData[i]["lend_rates"] };
      console.log("### TEMP ", temp);

      // arr.push(rawData[i]["lend_rates"][name]);
      arr.push(temp[name]);
    }

    console.log(`Map Specific Ran for ${name}.. ${arr}`);
    return arr;
  };

  const makeTuple = (x, y, name) => {
    const tuplesArr = [];
    for (let i = 0; i < xValues.length; i++) {
      let tuple = [x[i], y[i][name]];
      tuplesArr.push(tuple);
    }
    return tuplesArr;
  };

  const mapTuples = (x, y, name) => {
    const tuples = {};
    tuples["maker"] = [];
    tuples["compound"] = [];
    tuples["dydx"] = [];
    tuples["aave"] = [];

    tuples["maker"] = makeTuple(x, y, "maker");
    tuples["compound"] = makeTuple(x, y, "compound");
    tuples["dydx"] = makeTuple(x, y, "dydx");
    tuples["aave"] = makeTuple(x, y, "aave");

    // for (let i = 0; i < x.length; i++) {
    //   let tuple = [x[i], y[i]["maker"]];
    //   tuples["maker"].push(tuple);
    // }
    // for (let i = 0; i < x.length; i++) {
    //   let tuple = [x[i], y[i]["compound"]];
    //   tuples["compound"].push(tuple);
    // }

    // tuples["compound"] = makeTuple(
    //   mapXValues(props.data),
    //   mapYValues(props.data),
    //   "compound"
    // );

    return tuples;
  };

  // ### DEFINING useState LATER ####
  const [timestamps, setTimestamps] = useState();
  const [oneTimestamp, setOneTimestamp] = useState();
  const [lendRates, setLendRates] = useState();
  const [xValues, setXValues] = useState(mapXValues(props.data));
  const [yValues, setYValues] = useState(mapYValues(props.data));
  const [tuples, setTuples] = useState(
    mapTuples(mapXValues(props.data), mapYValues(props.data))
  );

  // const [yCompound, setYcompound] = useState(
  //   mapSpecific(props.data, "compound")
  // );
  // const [yCompound, setYcompound] = useState();

  const chartOptions = {
    title: {
      text: "Historic DeFi Interest Rates"
    },
    xAxis: {
      type: "datetime",
      dateTimeLabelFormats: {
        // don't display the dummy year
        // month: "%e. %b",
        // year: "%b"
        millisecond: "%H:%M:%S.%L",
        second: "%H:%M:%S",
        minute: "%H:%M",
        hour: "%H:%M",
        day: "%e. %b",
        week: "%e. %b",
        month: "%b '%y",
        year: "%Y"
      }
    },
    yAxis: {
      title: {
        text: "Exchange rate"
      }
    },
    legend: {
      enabled: false
    },
    series: [
      {
        name: "Compound Finance",
        // data: seedTuples
        // data: [1, 2, 3, 4, 5, 6, 7]
        data: tuples["compound"]
      },
      {
        name: "Maker",
        // data: [4, 2, 2, 1, 3, 6, 9]
        // data: seedTuples2
        data: tuples["maker"]
      },
      {
        name: "Aave",
        data: tuples["aave"]
      },
      {
        name: "dydx",
        data: tuples["dydx"]
      }
    ]
  };
  // const [chartOptions, setChartOptions] = useState({
  //   series: [
  //     {
  //       data: [1, 2, 3]
  //     }
  //   ]
  // });

  useEffect(() => {
    console.log("~~~ In History Graph Use Effect");
    // console.log("HIGHCHARTS - ", Highcharts);
    // console.log("HIST GRAPH - props.data: ", props.data);
    // setOneTimestamp(props.data[0]["timestamp"]);
    // console.log("X VALUES: ", mapXValues(props.data));
    // setYcompound(mapSpecific(props.data, "compound"));

    setXValues(mapXValues(props.data));
    // console.log("Xs VALUES: ", xValues);
    setYValues(mapYValues(props.data));
    // console.log("Ys VALUES ALL: ", yValues);
    // console.log("xValues LENGTH: ", xValues.length);
    // setTuples(mapTuples(mapXValues(props.data), mapYValues(props.data)));
    setTuples(mapTuples(xValues, yValues));
    console.log("TUPLE VALUES: ", tuples);
  }, [props.data, xValues]);

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      {/* <p>Historical Graph {props.data}</p> */}
      <p>One Timestamps: {oneTimestamp}</p>
      <p>One X Value: {JSON.stringify(xValues[0])}</p>
      <p>One Y Value: {JSON.stringify(yValues[0])}</p>
      {/* <p>One Y Value: {JSON.stringify(yValues[0]["maker"])}</p> */}
      {/* <p>One Y Value: {yValues}</p> */}
      <p>Tuple Value: {JSON.stringify(tuples)}</p>
      {/* <p>Tuple Value: {tuples}</p> */}
      {/* <p>Tuple Value: {JSON.stringify(tuples["maker"])}</p> */}
      <p>--- End of Graph --- </p>
    </div>
  );
};

export default HistoricalGraph;
