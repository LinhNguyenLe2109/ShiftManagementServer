const express = require("express");
const router = express.Router({ mergeParams: true });
const authenticateJWT = require("../../../middleware/auth");

router.get("/get/:scheduleId", authenticateJWT, require("./getTemplate"));
router.get("/getTemplateShifts/:scheduleId", authenticateJWT, require("./getTemplateShifts"));
router.post("/getFor", authenticateJWT, require("./getTemplateFor"));
router.post("/create", authenticateJWT, require("./createTemplate"));
router.delete("/delete", authenticateJWT, require("./deleteTemplate"));
router.put("/update", authenticateJWT, require("./updateTemplate"));

module.exports = router;
