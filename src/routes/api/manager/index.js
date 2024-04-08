const express = require("express");
const router = express.Router({ mergeParams: true });
const logger = require("../../../logger");
const authenticateJWT = require("../../../middleware/auth");
const authenticateAccessLevel = require("../../../middleware/accessLevel");

// GET /manager/:managerId
router.get("/:managerId", authenticateJWT, require("./getManager"));
// Response body:
// "id": "BI1bgN2VFZXjr6XCt1kV5ikKQ413",
// "employees": [],  //
// "categories": [], // Full category with id, name and description
// "unassignedShifts": [] //

// GET /manager/categoryList/manager:id
router.get("/categoryList/:managerId", authenticateJWT, require("./getCategoryList"));
// Returns a list of Category names

// PUT /manager/addCategory
router.put("/addCategory", authenticateJWT, authenticateAccessLevel(["1"]), require("./updateManagerCategory"));
// Example body:
// {
//     "managerId": "",
//     "managerUpdatedData": {
//       "addCategory": "categoryId"
//     }
// }
// PUT /manager/addEmployee
router.put("/addEmployee", authenticateJWT, authenticateAccessLevel(["1"]), require("./updateManagerEmployee"));
// Example body:
// {
//     "managerId": "",
//     "managerUpdatedData": {
//       "addEmployee": "employeeId"
//     }
// }

// PUT /manager/:managerId
router.put("/:managerId", authenticateJWT, authenticateAccessLevel(["1"]), require("./updateManagerInfo"));


// DELETE /manager/:managerId
router.delete("/:managerId", authenticateJWT, authenticateAccessLevel(["2"]), require("./deleteManager"));

module.exports = router;
