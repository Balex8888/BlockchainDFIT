const express = require("express");
const router = express.Router();
const blockchain = require("../getBlockchainData.js");
const pool = require("../db");
const path = require("path");

// seedLast128Blocks();
// async function seedLast128Blocks() {
//   console.log("Recent Blocks seeded");
// }
// async function update() {
//   console.log("Set Interval Ran Update");
//   var item = await blockchain.getRatesArray();
//   item[2] = item[2] * 1000; // accounting for milliseconds
//   // item[2] = item[2]; // accounting for milliseconds
//   // console.log('/update item: ', item);

//   var queryString = `INSERT INTO allblocks(compound, dsr, unixtime, block) VALUES(${item[0]}, ${item[1]}, ${item[2]}, ${item[3]})`;
//   await pool.query(queryString, (err, res) => {
//     if (err) {
//       console.log("DB INSERT ERROR ~ Block is already in database:", err.message);
//     } else {
//       console.log(`### SUCCESS: Added block ${JSON.stringify(item)} into the pool`);
//     }
//   });
// }
// setInterval(
//   update,

//   10000
// );

// define the home page route
router.get("/", (req, res) => {
  console.log("in / path.. ___dirname: ", __dirname);
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
  res.json("Historical Interest Rates Homepage");
});
// router.get("/", function(req, res) {
//   res.sendFile(path.join(__dirname, "client/build", "index.html"));
// });
// router.use(express.static(path.join(__dirname, "../client/build")));

router.get("/getlatestblocknumber", async (req, res) => {
  var blockNumber = await blockchain.getLatestBlockNumber();
  console.log(`Latest Block Number #### ${blockNumber}`);
  res.json(blockNumber);
});

// Route to get all historical blocks
router.get("/getallblocks", async (req, res) => {
  try {
    const allBlocks = await pool.query("SELECT unixtime, compound, dsr, block FROM allblocks ORDER BY block DESC");
    const data = allBlocks.rows;
    console.log(`/getallblocks --- Data for allBlocks: ${JSON.stringify(data)}`);

    res.json(data);
  } catch (err) {
    console.error(err.message);
  }
});

// Route to get only select most recent 128 blocks
router.get("/getrecentblocks", async (req, res) => {
  try {
    console.log(`\n--- /getrecentblocks hit`);
    const allBlocks = await pool.query("SELECT unixtime, compound, dsr, block FROM allblocks ORDER BY block DESC");
    const data = allBlocks.rows;
    console.log(`Data for recentBlocks --- : ${JSON.stringify(data)}`);

    // Send back only recent blocks, use /getallblocks for full histrical display
    if (data.length >= 127) {
      for (let i = 0; i < 127; i++) {
        let item = data[i];
        console.log(`item: ${item} , i: ${i}`);
      }
    } else {
      for (let i = 0; i < data.length; i++) {
        let item = data[i];
        console.log(`item: ${item} , i: ${i}`);
      }
    }

    res.json(data);
  } catch (err) {
    console.error(err.message);
  }
});

// Tuples only for compound
router.get("/getrecenttuplescompound", async (req, res) => {
  try {
    console.log(`\n--- /getrecenttuplescompound hit`);
    const allBlocks = await pool.query("SELECT unixtime, compound, dsr, block FROM allblocks ORDER BY block DESC");
    const data = allBlocks.rows;

    let tuplesArr = [];
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      let tuple = [item["unixtime"], item["compound"]];
      tuplesArr.push(tuple);
    }
    // console.log("Sending finshied tuples array: ", tuplesArr);
    console.log(`Sending finshied COMPOUND tuples array:  [[${tuplesArr[0]}], [${tuplesArr[1]}], [${tuplesArr[2]}]]`);
    res.json(tuplesArr);
    // res.json(tuplesArr.reverse());
  } catch (err) {
    console.error(err.message);
  }
});

// Tuples only for dsr
router.get("/getrecenttuplesdsr", async (req, res) => {
  try {
    console.log(`\n--- /getrecenttuplesdsr hit`);
    const allBlocks = await pool.query("SELECT unixtime, compound, dsr, block FROM allblocks ORDER BY block DESC");
    const data = allBlocks.rows;

    let tuplesArr = [];
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      let tuple = [item["unixtime"], item["dsr"]];
      tuplesArr.push(tuple);
    }
    // console.log("Sending finshied tuples array: ", tuplesArr);
    console.log(`Sending finshied DSR tuples array:  [[${tuplesArr[0]}], [${tuplesArr[1]}], [${tuplesArr[2]}]]`);
    res.json(tuplesArr);
    // res.json(tuplesArr.reverse());
  } catch (err) {
    console.error(err.message);
  }
});

// Update 128 historical blocks
router.get("/updaterecentblocks", async (req, res) => {
  var recentBlocks = await blockchain.getLast128Blocks(128);
  // var recentBlocks = await blockchain.getLast128Blocks(12);
  var count = 0;
  await updateDb();

  async function updateDb() {
    // Insert Blocks Into DB

    for (let i = 0; i < recentBlocks.length; i++) {
      let item = recentBlocks[i];
      item[2] = item[2] * 1000; // accounting for milliseconds
      // item[2] = item[2]; // accounting for milliseconds
      let queryString = `INSERT INTO allblocks(compound, dsr, unixtime, block) VALUES(${item[0]}, ${item[1]}, ${item[2]}, ${item[3]})`;

      await pool.query(queryString, async (err, res) => {
        if (err) {
          console.log("DB Pool INSERT ERROR ~ :", err.message);
        } else {
          console.log(`Succesfully added ${++count} blocks ${JSON.stringify(item)} into the pool`);
        }
      });
    }
  }

  res.status(200).json("Successfully added blocks to the pool");
});

// Route to update most recent block
router.get("/getcurrentblockfromblockchain", async (req, res) => {
  var item = await blockchain.getRatesArray();
  item[2] = item[2] * 1000; // accounting for milliseconds
  // item[2] = item[2]; // accounting for milliseconds
  console.log("/getcurrentblockfromblockchain item: ", item);

  // Removing DB Write, moved functionality to setInterval update
  // var queryString = `INSERT INTO allblocks(compound, dsr, unixtime, block) VALUES(${item[0]}, ${item[1]}, ${item[2]}, ${item[3]})`;
  // await pool.query(queryString, (err, res) => {
  //   if (err) {
  //     console.log("DB INSERT ERROR ~ Block is already in database:", err.message);
  //   } else {
  //     console.log(`Succesfully added block ${JSON.stringify(item)} into the pool`);
  //   }
  // });

  res.json(item);
});

// Route to getcurrentblockfromdb most recent block
router.get("/getcurrentblockfromdb", async (req, res) => {
  // var item = await blockchain.getRatesArray();
  // item[2] = item[2] * 1000; // accounting for milliseconds
  // console.log("/getcurrentblockfromdb ", item);

  const allBlocks = await pool.query("SELECT unixtime, compound, dsr, block FROM allblocks ORDER BY block DESC");
  const data = allBlocks.rows;
  // console.log(`All blocks --- : ${JSON.stringify(data)}`);
  const currentBlockObj = allBlocks.rows[0];
  // console.log(`Current blocks --- : ${JSON.stringify(currentBlockObj)}`);
  const currentBlockArray = [currentBlockObj["compound"], currentBlockObj["dsr"], parseInt(currentBlockObj["unixtime"]), currentBlockObj["block"]];

  // console.log(`/getcurrentblockfromdb - Updating Current Block  --- : ${JSON.stringify(currentBlockArray)}`);

  /// currentBlockObj for recentBlocks --- : {"unixtime":"1622722666000","compound":14.615839612867854,"dsr":1.0599999976112906,"block":10364641}
  // Desired Output Example:  [compound, dsr, unixtime, block]  [ 14.615839612867854, 1.0599999976112906, 1622722666000, 10364641 ]
  res.json(currentBlockArray);
});

router.get("/dev", (req, res) => {
  console.log("--- /dev endpoing hit\n");
  res.json("/dev endpoing hit");
});

router.post("/dev", (req, res) => {
  console.log("-- post hit /dev");
  console.log(req.body);
  res.json("post received");
});

module.exports = router;
