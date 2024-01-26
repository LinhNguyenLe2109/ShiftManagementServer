const { admin } = require("../database/firebase.config");
const logger = require("../logger");

const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const idToken = authHeader.split(" ")[1];
    logger.info("idToken: " + idToken);
    admin
      .auth()
      .verifyIdToken(idToken)
      .then(function (decodedToken) {
        res.locals.userDecodedToken = decodedToken;
        return next();
      })
      .catch(function (error) {
        console.log(error);
        return res.sendStatus(403);
      });
  } else {
    res.sendStatus(401);
  }
};

module.exports = authenticateJWT;
