const express = require("express");
const { createSuccessResponse } = require("../response.js");
const { authenticate } = require("../auth");
const router = express.Router();
router.use(`/api`, authenticate(), require("./api"));
router.post("/login", require("./login"));
//health check
router.get("/", (req, res) => {
  res.setHeader("Cache-Control", "no-cache");
  res.status(200).json(createSuccessResponse({}));
});
module.exports = router;
