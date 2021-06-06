import React, { useState, useEffect } from "react";
import useInterval from "./useInterval"; // Custom useInterval react hook
import axios from "axios";

// import Highcharts from "highcharts";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import boost from "highcharts-boost";
import seedTuples from "../data/seedDataTuples";
import seedTuples2 from "../data/seedDataTuples2";
window.Highcharts = Highcharts;
boost(Highcharts);

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
      var tempTimestamp = rawData[i]["timestamp"] * 1000; //Multiply by 1000 since HighCharts uses milliseconds
      arr.push(rawData[i]["timestamp"] * 1000);
    }

    // console.log("Map X Values Ran for timestamps..", arr);
    return arr;
  };

  const mapYValues = (rawData) => {
    let arr = [];
    for (let i = 0; i < rawData.length; i++) {
      var temp = { ...rawData[i]["lend_rates"] };
      arr.push(temp);
      // arr.push(rawData[i]["lend_rates"]);
    }

    // console.log("Map YValues Ran..", arr);
    return arr;
  };
  const mapSpecific = (rawData, name) => {
    let arr = [];
    for (let i = 0; i < rawData.length; i++) {
      // arr.push(rawData[i]["lend_rates"][name]);
      // console.log('#@# LEND RATES - No Name"]', rawData[i]["lend_rates"]);

      var temp = { ...rawData[i]["lend_rates"] };
      // console.log("### TEMP ", temp);

      // arr.push(rawData[i]["lend_rates"][name]);
      arr.push(temp[name]);
    }

    // console.log(`Map Specific Ran for ${name}.. ${arr}`);
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
  const [tuples, setTuples] = useState(mapTuples(mapXValues(props.data), mapYValues(props.data)));

  // const [compoundTuples, setCompoundTuples] = useState([
  //   [1622550502000, 14.619947024405832],
  //   [1622550469000, 14.619947024405832],
  //   [1622550407000, 14.619947024405832]
  // ]);
  const [CompoundTuples, setCompoundTuples] = useState(props.CompoundBlockTuples);
  const [DsrTuples, setDsrTuples] = useState(props.DsrBlockTuples);
  // const [CompoundTuples, setCompoundTuples] = useState(tuples["compound"]);

  // const [yCompound, setYcompound] = useState(
  //   mapSpecific(props.data, "compound")
  // );
  // const [yCompound, setYcompound] = useState();

  // Original Chart Options
  const chartOptionsOriginal = {
    chart: {
      height: 500,
      width: 1200,
      type: "line"
    },
    title: {
      text: "Historic DeFi Interest Rates"
    },
    xAxis: {
      title: {
        text: "Date"
      },
      type: "datetime",
      offset: 20,
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
        text: "Interest Rates (%)"
        // max: 10
      },
      // tickPositions: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      offset: 0
    },
    boost: {
      useGPUTranslations: true,
      // Chart-level boost when there are more than 1 series in the chart
      seriesThreshold: 1
    },
    legend: {
      enabled: true
    },
    series: [
      {
        name: "Compound Finance",
        data: tuples["compound"],
        // lineWidth: 1,
        marker: {
          enabled: false
        },
        boostThreshold: 1 // Boost when there are more than 1
        // data: seedTuples
        // point in the series.
      },
      ////// Uncomment For Block Data
      // {
      //   name: "Compound Block Data",
      //   // data: props.CompoundBlockTuples,
      //   data: CompoundTuples,
      //   // lineWidth: 1,
      //   marker: {
      //     enabled: true
      //   },
      //   boostThreshold: 1 // Boost when there are more than 1
      // },
      ////// Uncomment for Block Data
      ////// Uncomment For Block Data
      // {
      //   name: "DSR Block Data",
      //   // data: props.DsrBlockTuples,
      //   data: DsrTuples,
      //   // lineWidth: 1,
      //   marker: {
      //     enabled: true
      //   },
      //   boostThreshold: 1 // Boost when there are more than 1
      // },
      ///////////  const [CompoundTuples, setCompoundTuples] = useState(props.CompoundBlockTuples);
      /////////// const [DsrTuples, setDsrTuples] = useState(props.DsrBlockTuples);
      ////// Uncomment for Block Data
      {
        name: "Maker",
        data: tuples["maker"],
        color: "#FF0000",
        marker: {
          enabled: true
        }
        // data: [4, 2, 2, 1, 3, 6, 9]
        // data: seedTuples2
      },
      {
        name: "Aave",
        data: tuples["aave"],
        marker: {
          enabled: false
        }
      },
      {
        name: "dydx",
        data: tuples["dydx"],
        marker: {
          enabled: false
        }
      }
    ]
  };

  const chartOptions = {
    chart: {
      height: 500,
      width: 1200
      // type: "line"
    },
    title: {
      text: "Live Blockchain Interest Rates"
    },
    xAxis: {
      title: {
        text: "Date"
      },
      type: "datetime",
      // tickPositions: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],

      // range: 6 * 30 * 24 * 3600 * 1000, //// 6 Months Range
      offset: 20,
      // dateTimeLabelFormats: {
      //   // don't display the dummy year
      //   month: "%e. %b",
      //   year: "%b"
      // }
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
        text: "Interest Rates (%)"
        // max: 10
      },
      tickPositions: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      offset: 0
    },
    boost: {
      useGPUTranslations: true,
      // Chart-level boost when there are more than 1 series in the chart
      seriesThreshold: 1
    },
    legend: {
      enabled: true
    },
    series: [
      // {
      //   name: "Compound Finance",
      //   data: tuples["compound"],
      //   // lineWidth: 1,
      //   marker: {
      //     enabled: false
      //   },
      //   boostThreshold: 1 // Boost when there are more than 1
      //   // data: seedTuples
      //   // point in the series.
      // },
      ////// Uncomment For Block Data

      {
        name: "Compound Block Data",
        // data: [
        //   [1622550502000, 14.619947024405832],
        //   [1622550469000, 14.619947024405832],
        //   [1622550407000, 14.619947024405832],
        //   [1622557440000, 14.619947024405832]
        // ],
        // data: [
        //   [1622550502, 14.619947024405832],
        //   [1622550469, 14.619947024405832],
        //   [1622550407, 14.619947024405832],
        //   [1622557440, 14.619947024405832]
        // ],
        data: props.CompoundBlockTuples,
        // data: CompoundTuples,
        // lineWidth: 1,
        marker: {
          enabled: true
        },
        boostThreshold: 1 // Boost when there are more than 1
      },
      ////// Uncomment for Block Data
      ////// Uncomment For Block Data
      {
        name: "DSR Block Data",
        data: props.DsrBlockTuples,
        // data: DsrTuples,
        // lineWidth: 1,
        marker: {
          enabled: true
        },
        boostThreshold: 1 // Boost when there are more than 1
      }
      //////////////// Dummy Reference Line
      // {
      //   name: "reference dummy line",
      //   showInLegend: false,
      //   color: "#FFFFFF",
      //   // color: "#000000",
      //   // data: [
      //   //   [1622550502000, 10.619947024405832],
      //   //   [1622550469000, 10.619947024405832],
      //   //   [1622550407000, 10.619947024405832],
      //   //   [1622557440000, 10.619947024405832]
      //   // ],
      //   data: [[1622644367000, 0.5], [(1622550502000, 0.5)], [1622550469000, 0.5], [1622550407000, 0.5]],

      //   // data: [
      //   //   [1622550502, 10],
      //   //   [1622550469, 10],
      //   //   [1622550407, 10],
      //   //   [1622557440, 10]
      //   // ],
      //   // data: props.CompoundBlockTuples,
      //   // data: CompoundTuples,
      //   // lineWidth: 1,
      //   marker: {
      //     enabled: false
      //   },
      //   boostThreshold: 1 // Boost when there are more than 1
      // }
      //////////////// Dummy Reference Line
    ]
  };

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

    console.log("COMPOUND TUPLE VALUES BEFORE: ", CompoundTuples);
    setCompoundTuples(props.CompoundBlockTuples);
    setDsrTuples(props.DsrBlockTuples);
    console.log("COMPOUND props.CompoundBlockTuples VALUES AFTER: ", props.CompoundBlockTuples);
    // }, [props.data, xValues, CompoundTuples, DsrTuples]);
  }, [props.data, xValues]);
  // }, [props.data]);
  // }, []);
  // });

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={chartOptionsOriginal} oneToOne={true} updateArgs={[true, true, true]} />
      <HighchartsReact highcharts={Highcharts} options={chartOptions} oneToOne={true} updateArgs={[true, true, true]} />
      {/* <p>Historical Graph {props.data}</p> */}
      {/* <p>Dates: {oneTimestamp}</p>
      <p>One X Value: {JSON.stringify(xValues[0])}</p>
      <p>One Y Value: {JSON.stringify(yValues[0])}</p> */}
      {/* <p>One Y Value: {JSON.stringify(yValues[0]["maker"])}</p> */}
      {/* <p>One Y Value: {yValues}</p> */}
      {/* <p>Tuple Value: {JSON.stringify(tuples)}</p> */}
      {/* <p>Tuple Value: {tuples}</p> */}
      {/* <p>Tuple Value: {JSON.stringify(tuples["maker"])}</p> */}

      {/* <h1>Live Tuple Data:</h1>
      <p>Current Block Tuples: {props.currentBlockData}</p>
      <p>
        DSR Tuples: {DsrTuples[0][0]} {DsrTuples[0][1]}
      </p>
      <p>
        props DSR Tuples: {props.DsrBlockTuples[0][0]} {props.DsrBlockTuples[0][1]}
      </p>
      <p>
        Compound Tuples: {CompoundTuples[0][0]} {CompoundTuples[0][1]}
      </p>
      <p>
        props Compound Tuples: {props.CompoundBlockTuples[0][0]} {props.CompoundBlockTuples[0][1]}
      </p>
      <p>--- End of Graph --- </p> */}
    </div>
  );
};

export default HistoricalGraph;
