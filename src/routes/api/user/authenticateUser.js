const logger = require("../../../logger");
const { signin } = require("../../../database/authentication");

const authenticateUser = async (req, res) => {
  try {
    logger.info("authenticateUser: login");
    const email = req.body.email;
    const password = req.body.password;
    logger.info("email: " + email);
    logger.info("Password: " + password);

    const user = await signin(email, password);
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (err) {
    logger.error(err);
  }
};

module.exports = authenticateUser;
