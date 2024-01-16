const { createSuccessResponse, createErrorResponse } = require("../response.js");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const auth = getAuth();
// expecting email, password
module.exports = async (req, res) => {
  /*
    signInWithEmailAndPassword(auth, req.email, req.password)
      .then((userCredential) => {
        //const user = userCredential.user;
        res
          .status(200)
          .json(createSuccessResponse({ userCredential: userCredential }));
      })
      .catch((error) => {
        //const errorCode = error.code;
        res.status(400).json(createErrorResponse(400, error.message));
      });*/
  res.status(400).json(createErrorResponse(400, "TODO"));
  //TODO; https://firebase.google.com/docs/auth/admin/create-custom-tokens
};
