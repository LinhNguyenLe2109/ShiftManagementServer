const express = require("express");
const router = express.Router({ mergeParams: true });
const logger = require("../../../logger");
const authenticateJWT = require("../../../middleware/auth");

router.get("/get/:shiftId", authenticateJWT, require("./getShift"));
router.get("/getRange", authenticateJWT, require("./getShifts"));
router.post("/create", authenticateJWT, require("./createShift"));
router.delete("/delete", authenticateJWT, require("./deleteShift"));
router.put("/update", authenticateJWT, require("./updateShift"));

module.exports = router;
