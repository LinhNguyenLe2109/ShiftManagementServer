const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} = require("firebase/auth");
const { app, admin } = require("./firebase.config");
const logger = require("../logger");

const auth = getAuth(app);

// Sign up new user
// @param email - string
// @param password - string
// @return userInformation - object
const signup = async (email, password) => {
  try {
    // logger.info("email: " + email);
    // logger.info("Password: " + password);
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    return user;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    logger.error(errorCode, errorMessage);
  }
};

// Sign in existing user
// @param email - string
// @param password - string
// @return userInformation - object
const signin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    logger.info(user.toString());
    return user;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    logger.error(errorCode, errorMessage);
  }
};

const removeUserFromAuthDb = async (uid) => {
  try {
    await admin.auth().deleteUser(uid);
    return true;
  } catch (e) {
    logger.error("Error deleting user from auth db: " + e);
    return false;
  }
};

module.exports = { signup, signin, removeUserFromAuthDb };
