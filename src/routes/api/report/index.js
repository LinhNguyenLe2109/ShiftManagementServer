const express = require("express");
const router = express.Router({ mergeParams: true });
const logger = require("../../../logger");
const authenticateJWT = require("../../../middleware/auth");
const authenticateAccessLevel = require("../../../middleware/accessLevel");

// POST /report/createNew
router.post(
  "/createNew",
  authenticateJWT,
  authenticateAccessLevel(["1"]),
  require("./createEmptyReport")
);

// POST /report/createPopulated
router.post(
  "/createPopulated",
  authenticateJWT,
  authenticateAccessLevel(["1"]),
  require("./createPopulatedReport")
);

// GET /report/reportId
router.get("/:reportId", authenticateJWT, require("./getReport"));

// PUT /report/update
router.put(
  "/update",
  authenticateJWT,
  authenticateAccessLevel(["1"]),
  require("./updateReport")
);

// DELETE /report/delete
router.delete(
  "/delete",
  authenticateJWT,
  authenticateAccessLevel(["1"]),
  require("./deleteReport")
);

module.exports = router;
