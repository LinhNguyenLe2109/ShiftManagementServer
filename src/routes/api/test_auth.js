const { createSuccessResponse } = require("../../response.js");
module.exports = async (req, res) => {
  res.status(200).json(
    createSuccessResponse({})
  );
};
