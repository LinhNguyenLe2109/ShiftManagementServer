const authorize = require("./auth-middleware");
const BearerStrategy = require("passport-http-bearer").Strategy;
const fire = require("../fire.js");
const { getAuth, signInWithCustomToken } = require("firebase/auth");

const auth = getAuth();
logger.info("Configured to use FireAuth!");

module.exports.strategy = () =>
  new BearerStrategy(async (token, done) => {
    try {
      const userCredential = await signInWithCustomToken(auth, token)
      logger.debug({ userCredential }, "verified user token");
      done(null, userCredential.user);
    } catch (err) {
      logger.error({ err, token }, "could not verify token");
      done(null, false);
    }
  });

module.exports.authenticate = () => authorize("bearer");
