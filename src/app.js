const dotenv = require("dotenv").config();
const express = require("express");
const app = express();
const pino = require("pino-http")();
const helmet = require("helmet");
const logger = require("./logger");
const passport = require("passport");
const authenticate = require("./auth/index.js");
var cors = require("cors");

app.use(pino);
app.use(helmet());
app.use(cors());
passport.use(authenticate.strategy());
app.use(passport.initialize());

process.on("uncaughtException", (err, origin) => {
  logger.fatal({ err, origin }, "uncaughtException");
  throw err;
});
process.on("unhandledRejection", (reason, promise) => {
  logger.fatal({ reason, promise }, "unhandledRejection");
  throw reason;
});

app.get("/", (req, res) => {
  req.log.info("something");
  res.send("Hello World!");
});
app.use("/", require("./routes"));

module.exports = app;
