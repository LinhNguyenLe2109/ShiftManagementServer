const { signup } = require("../../../database/authentication");
const { createEmployee } = require('../../../database/employee');
const { User } = require("../../../database/users");
const logger = require('../../../logger');

const createNewEmployee = async (req, res) => {
  try {
    logger.info('createNewEmployee called');
    logger.info("authenticateUser: register");
    
    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName ? req.body.firstName : "";
    const lastName = req.body.lastName ? req.body.lastName : "";
    const accessLevel = 0;
    const reportTo = req.body.reportTo ? req.body.reportTo : "";
    const active = req.body.active ? req.body.active : 0;

    const managerId = req.body.managerId;

    const user = await signup(email, password);
    if (user) {
      userObj = new User({
        id: user.uid,
        email: user.email,
        firstName,
        lastName,
        accessLevel,
        reportTo,
        active,
      });
      logger.debug(userObj);
      const employee = await createEmployee(userObj.id, managerId);
      logger.info("Employee created");
      res.status(200).json(employee);
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (error) {
    logger.error(`Error creating employee: ${error}`);
    res.status(500).send('Error in createNewEmployee');
  }
};

module.exports = createNewEmployee;