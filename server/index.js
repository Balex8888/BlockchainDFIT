const express = require("express");
const app = express();
const router = express.Router();
const cors = require("cors");
const pool = require("./db");
const axios = require("axios");
const indexRouter = require("./routes/router");
const { update, seedLast128Blocks } = require("./routes/update");

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/", indexRouter);

// Seeding Data + Automatic live block updates
seedLast128Blocks();
setInterval(update, 5000);

app.listen(5000, () => {
  console.log("DFIT Server has started on port 5000");
});
