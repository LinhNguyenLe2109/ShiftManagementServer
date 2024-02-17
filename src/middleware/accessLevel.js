const { admin } = require("../database/firebase.config");
const { getUserInfo } = require("../database/users")
const logger = require("../logger");
//Usage: router.get("/route", authenticateJWT, authenticateAccessLevel(PARAM), require("./etc"));
//PARAM being an array of allowed access levels: ["0","1","2"]
const authenticateAccessLevel = (allowedLevels) => {
  return async (req, res, next) => {
    logger.debug("Checking access level...");
    getUserInfo(res.locals.userDecodedToken.uid)
      .then(function (userObject) {
        for (const x of allowedLevels) if (userObject.accessLevel == x) return next();
        logger.debug("Request lacks proper access level!");
        res.sendStatus(403);
      })
      .catch(function (error) {
        console.log(error);
        return res.sendStatus(403);
      });
  };
}
module.exports = authenticateAccessLevel;
