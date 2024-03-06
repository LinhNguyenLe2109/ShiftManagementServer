const logger = require("../../../logger");
const { signup } = require("../../../database/authentication");
const { User, createUser } = require("../../../database/users");
const verifyString = require("../../../utils/verifyString");
const createErrorResponse = require("../../../utils/createErrorResponse");

const createNewUser = async (req, res) => {
  try {
    logger.info("authenticateUser: register");
    // Extract info from request
    // Check if email is there
    if (verifyString(req.body.email) === false) {
      res.status(400).send(createErrorResponse(400, "Email is required"));
      return;
    }
    // Check if password is there
    if (verifyString(req.body.password) === false) {
      res.status(400).send(createErrorResponse(400, "Password is required"));
      return;
    }
    const email = req.body.email;
    const password = req.body.password;
    const firstName = verifyString(req.body.firstName)
      ? req.body.firstName
      : "";
    const lastName = verifyString(req.body.lastName) ? req.body.lastName : "";
    const accessLevel = req.body.accessLevel ? Number(req.body.accessLevel) : 0;
    const active = req.body.active ? req.body.active : 0;

    const user = await signup(email, password);
    if (user) {
      userObj = {
        id: user.uid,
        email: user.email,
        firstName,
        lastName,
        accessLevel,
        active,
      };
      logger.debug("User created" + JSON.stringify(userObj));
      const userData = await createUser(userObj);
      res.status(200).json({ ...userData });
    } else {
      res.status(401).send(createErrorResponse(401, "Invalid credentials"));
    }
  } catch (err) {
    logger.error(err);
  }
};

module.exports = createNewUser;
