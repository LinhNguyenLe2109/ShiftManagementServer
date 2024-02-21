const logger = require("../../../logger");
const { signup } = require("../../../database/authentication");
const { User, createUser } = require("../../../database/users");
const { getIdToken } = require("firebase/auth");

const createNewUser = async (req, res) => {
  try {
    logger.info("authenticateUser: register");
    // Extract info from request
    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName ? req.body.firstName : "";
    const lastName = req.body.lastName ? req.body.lastName : "";
    const accessLevel = req.body.accessLevel ? Number(req.body.accessLevel) : 0;
    const reportTo = req.body.reportTo ? req.body.reportTo : "";
    const active = req.body.active ? req.body.active : 0;

    const user = await signup(email, password);
    if (user) {
      //const idToken = await getIdToken(user);
      userObj = {
        id: user.uid,
        email: user.email,
        firstName,
        lastName,
        accessLevel,
        active,
        reportTo,
      };
      logger.debug("User created" + JSON.stringify(userObj));
      const userData = await createUser(userObj);
      res.status(200).json({ ...userData });
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (err) {
    logger.error(err);
  }
};

module.exports = createNewUser;
