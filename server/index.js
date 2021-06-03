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

// ROUTES
app.use("/", indexRouter);

// Seeding Data + Automatic live block updates
seedLast128Blocks();
setInterval(update, 5000);

const port = 9001;
app.listen(port, () => {
  console.log(`DFIT Server has started on port ${port}`);
});
