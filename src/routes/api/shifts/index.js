const express = require("express");
const router = express.Router({ mergeParams: true });
const logger = require("../../../logger");
const authenticateJWT = require("../../../middleware/auth");

// GET /shiftInstance
router.get("/get/:shiftId", authenticateJWT, require("./getShift"));
router.post("/updateSchedule", authenticateJWT, require("./updateSchedule"));
module.exports = router;
