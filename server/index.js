const express = require("express");
const app = express();
const router = express.Router();
const path = require("path");
const cors = require("cors");
const pool = require("./db");
const axios = require("axios");
const indexRouter = require("./routes/router");
const { update, seedLast128Blocks } = require("./routes/update");

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client/build")));
// app.use(express.static(path.join(__dirname, "../client/build/index.html")));

// ROUTES
app.use("/", indexRouter);

// console.log(`----- in /mainserver path.. ___dirname: `, __dirname);
// console.log(`----- in /mainserver path.. path.join(__dirname, "../client/build")`, path.join(__dirname, "../client/build"));

// Seeding Data + Automatic live block updates
seedLast128Blocks();
setInterval(update, 5000);

const port = 3001;
app.listen(port, () => {
  console.log(`DFIT Server has started on port ${port}`);
});
/* app.listen(port, "0.0.0.0", () => {
        console.log(`DFIT Server has started on port ${port} and 0.0.0.0`);
      }); */
