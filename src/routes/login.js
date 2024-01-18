const { createSuccessResponse, createErrorResponse } = require("../response.js");
const { signInWithEmailAndPassword } = require("firebase/auth");
const { auth } = require("../fire.js");
module.exports = async (req, res) => {
  if (!(req.body && req.body.email && req.body.password)) {
    res.status(400).json(createErrorResponse(400, "Missing email or password"));
  } else {
    signInWithEmailAndPassword(auth, req.body.email, req.body.password)
    .then((userCredential) => {
      userCredential.user.getIdToken(true).then((token) => {
        user =  {
          username : req.body.email,
          token,
          authorizationHeaders: (type = 'application/json') => {
            const headers = { 'Content-Type': type };
            headers['Authorization'] = `Bearer ${token}`;
            return headers;
          }
        };
        res.status(200).json(createSuccessResponse({ user }));
      });
    })
    .catch((error) => {
      res.status(400).json(createErrorResponse(400, req.body));
    });
  }
};
