//server.js
const app = require("./app");
const logger = require("./logger");
const port = 3000;

app.listen(port, () => {
  logger.info(`Example app listening on port ${port}!`);
});
