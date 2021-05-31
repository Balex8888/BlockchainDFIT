const express = require("express");
const app = express();
const router = express.Router();
const cors = require("cors");
const pool = require("./db");
const axios = require("axios");
const indexRouter  = require('./routes/router');

// MIDDLEWARE
app.use(cors());
app.use(express.json());


// ROUTES
app.use('/', indexRouter);


app.listen(5000, () => {
  console.log("DFIT Server has started on port 5000");
});
