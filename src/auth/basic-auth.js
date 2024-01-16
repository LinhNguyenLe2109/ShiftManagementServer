// Configure HTTP Basic Auth strategy for Passport, see:
// https://github.com/http-auth/http-auth-passport

const auth = require("http-auth");
const authorize = require("./auth-middleware");
const authPassport = require("http-auth-passport");
const logger = require("../logger");

// We expect HTPASSWD_FILE to be defined.
if (!process.env.HTPASSWD_FILE) {
  throw new Error("missing expected env var: HTPASSWD_FILE");
}
logger.info("Configured to use BasicAuth!");

module.exports.strategy = () =>
  // For our Passport authentication strategy, we'll look for a
  // username/password pair in the Authorization header.
  authPassport(
    auth.basic({
      file: process.env.HTPASSWD_FILE,
    })
  );
module.exports.authenticate = () => authorize("http");
