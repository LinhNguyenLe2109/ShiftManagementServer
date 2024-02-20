const express = require("express");
const router = express.Router({ mergeParams: true });
const logger = require("../../../logger");
const authenticateJWT = require("../../../middleware/auth");
const authenticateAccessLevel = require("../../../middleware/accessLevel");

router.get("/get/:shiftId", authenticateJWT, require("./getShift"));
router.post("/getRange", authenticateJWT, require("./getShifts"));
router.post("/create", authenticateJWT, require("./createShift"));
router.delete("/delete/:shiftId", authenticateJWT, require("./deleteShift"));
router.put("/update", authenticateJWT, require("./updateShift"));
router.post("/getUnassignedShifts", authenticateJWT, authenticateAccessLevel(["1"]), require("./getUnassignedShifts"));

// why is there a schedule route here?
// router.post("/updateSchedule", authenticateJWT, authenticateAccessLevel(["1"]), require("./updateSchedule"));

module.exports = router;
