const express = require("express");
const router = express.Router({ mergeParams: true });
const logger = require("../../../logger");
const authenticateJWT = require("../../../middleware/auth");

router.get("/get/:scheduleId", authenticateJWT, require("./getSchedule"));
router.get("/getScheduleShifts/:scheduleId", authenticateJWT, require("./getScheduleShifts"));
router.get(
  "/getAll/:employeeId",
  authenticateJWT,
  require("./getAllSchedules")
);
router.post("/getByDate", authenticateJWT, require("./getScheduleByDate"));
router.post("/create", authenticateJWT, require("./createSchedule"));
router.delete("/delete", authenticateJWT, require("./deleteSchedule"));
router.put("/update", authenticateJWT, require("./updateSchedule"));

module.exports = router;
