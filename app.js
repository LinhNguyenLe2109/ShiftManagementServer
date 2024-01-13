const express = require("express");
const app = express();
const port = 3000;
const pino = require("pino-http")();
const logger = require("./logger");
var cors = require('cors')

app.use(pino);
app.use(cors());

logger.info("hi");
app.get("/", (req, res) => {
  req.log.info("something");
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
