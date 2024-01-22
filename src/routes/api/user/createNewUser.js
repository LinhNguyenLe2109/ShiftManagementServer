const logger = require("../../../logger");
const { signup } = require("../../../database/authentication");

const createNewUser = async (req, res) => {
  try {
    logger.info("authenticateUser: register");
    const email = req.body.email;
    const password = req.body.password;

    const user = await signup(email, password);
    if (user) {
      const idToken = await getIdToken(user);
      res.status(200).json({ token: idToken });
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (err) {
    logger.error(err);
  }
};

module.exports = createNewUser;
