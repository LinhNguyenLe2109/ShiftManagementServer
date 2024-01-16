if (
  process.env.BASICAUTH != "true"
) {
  module.exports = require("./fireauth");
}
else if (process.env.HTPASSWD_FILE && process.NODE_ENV !== "production") {
  module.exports = require("./basic-auth");
}
else {
  throw new Error("Missing .HTPASSWD_FILE");
}
