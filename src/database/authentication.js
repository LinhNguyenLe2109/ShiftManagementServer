const { getAuth, createUserWithEmailAndPassword } = require("firebase/auth");
const { app } = require("./firebase.config");
const logger = require("../../logger");

const auth = getAuth(app);

// Sign up new user
// @param email - string
// @param password - string
// @return userInformation - object
const signup = (email, password) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      logger.info(user.toString());
      return user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      logger.error(errorCode, errorMessage);
    });
};

// Sign in existing user
// @param email - string
// @param password - string
// @return userInformation - object
const signin = (email, password) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      logger.info(user.toString());
      return user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      logger.error(errorCode, errorMessage);
    });
};

module.exports = { signup, signin };
