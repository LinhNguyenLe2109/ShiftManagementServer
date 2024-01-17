const authorize = require("./auth-middleware");
const BearerStrategy = require("passport-http-bearer").Strategy;
const fire = require("../fire.js");
const logger = require("../logger");
const { getAuth, signInWithCustomToken } = require("firebase-admin/auth");

const auth = getAuth();
logger.info("Configured to use FireAuth!");

module.exports.strategy = () =>
  new BearerStrategy(async (token, done) => {
    auth.verifyIdToken(token)
    .then((decodedToken) => {
      const uid = decodedToken.uid;
      logger.debug({ uid }, "verified user token");
      done(null, uid);
    })
    .catch((error) => {
      logger.error({ err, token }, "could not verify token");
      done(null, false);
    });
  });

module.exports.authenticate = () => authorize("bearer");
