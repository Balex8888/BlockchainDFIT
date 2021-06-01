const express = require("express");
const router = express.Router();
const blockchain  = require("../getBlockchainData.js")
const pool = require("../db");

// define the home page route
router.get('/', (req, res) => {
  res.json('Birds home page')
})
// define the about route
router.get('/about', (req, res) => {
  res.json('About birds')
})

router.get('/getlatestblocknumber', async (req, res) => {
  var blockNumber = await blockchain.getLatestBlockNumber()
  console.log(`Latest Block Number #### ${blockNumber}`)
  res.json(blockNumber)
})



// Route to update 128 historical blocks
router.get('/getrecentblocks', async (req, res) => {
  var recentBlocks = await blockchain.getLast128Blocks(2);
  var count = 0;
  await updateDb();

  async function updateDb() {
    // Insert Blocks Into DB

    for (let i=0; i<recentBlocks.length; i++){
      let item = recentBlocks[i]
      var queryString = `INSERT INTO allblocks(unixtime, compound, dsr, block) VALUES(${item[2]}, ${item[0]}, ${item[1]}, ${item[3]})`
      await pool.query(queryString, async (err,res)=>{
      // console.log("POOL INSERT ERROR ~ :", err)
      console.log(`Succesfully added ${++count} ${res} blocks into the pool`)
      }
    )}

  }




  try {
    const allBlocks = await pool.query("SELECT unixtime, compound, dsr, block FROM allblocks ORDER BY block DESC");
    const data = allBlocks.rows;
    console.log(`Data for allBlocks --- : ${data}`);
    // data.forEach(row => {
    //     console.log(`reading - unixtime: ${row.unixtime} compound: ${row.compound}, dsr: ${row.dsr} block: ${row.block} `);
    // })
    res.json(data);
  } catch (err) {
    console.error(err.message);
  }




  // var output = await retrieveRecentBlocks();
  // console.log('/getrecentblocks output: ', output);
  // res.json(output)

})



// Route to update most recent block
router.get('/update', async (req, res) => {
  var item = await blockchain.getRatesArray();
  console.log('/update item: ', item);
  


  // const newEntry = await pool.query("INSERT INTO allblocks (unixtime) VALUES($1) RETURNING *", [description]);
  // const newEntry = await pool.query("INSERT INTO allblocks (description) VALUES($1) RETURNING *", [description]);
  // res.json(newEntry.rows[0])

var queryString = `INSERT INTO allblocks(unixtime, compound, dsr, block) VALUES(${item[2]}, ${item[0]}, ${item[1]}, ${item[3]})`
await pool.query(queryString, (err,res)=>{
  console.log("OUR POOL ERROR ~ :", err)
  console.log("OUR POOL RES ~ :", res)
})


  res.json(item)

})

/*
CREATE TABLE allblocks(
  unixtime TIMESTAMP PRIMARY KEY,
  compound FLOAT,
  dsr FLOAT
);
*/


module.exports = router;