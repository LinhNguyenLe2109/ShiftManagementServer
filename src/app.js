const dotenv = require("dotenv").config();
const express = require("express");
const app = express();
const pino = require("pino-http")();
const logger = require("../logger");
const { db } = require("./database/firebase.config");
var cors = require("cors");

app.use(pino);
app.use(cors());

app.use("/", require("./routes"));
module.exports = app;
