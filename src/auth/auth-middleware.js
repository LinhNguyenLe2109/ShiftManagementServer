const passport = require("passport");
const logger = require("../logger");

const { createErrorResponse } = require("../response");

/**
 * @param {'bearer' | 'http'} strategyName - the passport strategy to use
 * @returns {Function} - the middleware function to use for authentication
 */
module.exports = (strategyName) => {
  return function (req, res, next) {
    function callback(err, user) {
      if (err) {
        logger.warn({ err }, "error authenticating user");
        return next(createErrorResponse(500, "Unable to authenticate user"));
      }
      if (!user) {
        return res.status(401).json(createErrorResponse(401, "Unauthorized"));
      }
      req.user = user;
      logger.debug({ user, token: req.token }, "Authenticated user");
      next();
    }
    passport.authenticate(strategyName, { session: false }, callback)(req, res, next);
  };
};
