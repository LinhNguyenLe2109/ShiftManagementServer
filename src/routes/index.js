const express = require("express");

const router = express.Router({ mergeParams: true });
router.use("/user", require("./api/user"));
router.use("/shifts", require("./api/shifts"));

router.use("/schedule", require("./api/schedule"));

router.use("/categories", require("./api/categories"));
router.use("/employee", require("./api/employee"));
router.use("/manager", require("./api/manager"));
router.use("/admin", require("./api/admin"));


//health check
router.get("/", (req, res) => {
  res.setHeader("Cache-Control", "no-cache");
  res.json("Hello World!");
});
module.exports = router;
