const express = require("express");
const router = express.Router({ mergeParams: true });
const logger = require("../../../logger");
const authenticateJWT = require("../../../middleware/auth");

router.get("/get/:scheduleId", authenticateJWT, require("./getSchedule"));
router.get(
  "/getAll/:employeeId",
  authenticateJWT,
  require("./getAllSchedules")
);
router.get("/getByDate", authenticateJWT, require("./getScheduleByDate"));
router.post("/create", authenticateJWT, require("./createSchedule"));
router.delete("/delete", authenticateJWT, require("./deleteSchedule"));
router.put("/update", authenticateJWT, require("./updateSchedule"));

module.exports = router;
