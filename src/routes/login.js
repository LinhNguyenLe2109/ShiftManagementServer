const { createSuccessResponse, createErrorResponse } = require("../response.js");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const auth = getAuth();
// expecting email, password
module.exports = async (req, res) => {
  var header = req.headers.authorization || '';
  var token = header.split(/\s+/).pop() || '';
  var authHeader = Buffer.from(token, 'base64').toString();
  var parts = authHeader.split(/:/);
  var username = parts.shift();
  var password = parts.join(':'); 
  signInWithEmailAndPassword(auth, username, password)
    .then((userCredential) => {
      console.log(userCredential);
      res
        .status(200)
        //Why am I doing this whole thing? This is what passport is for LOL
        //.json(createSuccessResponse({ userCredential: userCredential }));
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json(createErrorResponse(400, error.message));
    });
};
