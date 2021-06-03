const blockchain = require("../getBlockchainData.js");
const pool = require("../db");

async function update() {
  console.log("Set Interval Ran - Checking for new blocks");
  var item = await blockchain.getRatesArray();
  item[2] = item[2] * 1000; // accounting for milliseconds
  // item[2] = item[2]; // accounting for milliseconds
  // console.log('/update item: ', item);

  var queryString = `INSERT INTO allblocks(compound, dsr, unixtime, block) VALUES(${item[0]}, ${item[1]}, ${item[2]}, ${item[3]})`;
  await pool.query(queryString, (err, res) => {
    if (err) {
      console.log("DB INSERT ERROR ~ Block is already in database:", err.message);
    } else {
      console.log(`### SUCCESS: Added block ${JSON.stringify(item)} into the pool`);
    }
  });
}

async function seedLast128Blocks() {
  console.log("Seeding last 128 blocks...");
  // var recentBlocks = await blockchain.getLast128Blocks(128);
  var recentBlocks = await blockchain.getLast128Blocks(128);
  var count = 0;
  await seedDb();

  async function seedDb() {
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
  console.log("Seeding finished");
}

module.exports = { update, seedLast128Blocks };
