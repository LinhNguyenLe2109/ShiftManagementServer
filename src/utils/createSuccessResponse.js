const logger = require("../logger");

/**
 * A successful response looks like:
 *
 * {
 *   "status": "ok",
 *   ...
 * }
 */

function createSuccessResponse(data) {
  logger.debug({ data }, "createSuccessResponse");
  return {
    status: "ok",
    ...data,
  };
}

module.exports = createSuccessResponse;
