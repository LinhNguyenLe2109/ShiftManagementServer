const logger = require("../logger");

/**
 * An error response looks like:
 *
 * {
 *   "status": "error",
 *   "error": {
 *     "code": 400,
 *     "message": "invalid request, missing ...",
 *   }
 * }
 */
function createErrorResponse(code, message) {
  logger.debug({ code, message }, "createErrorResponse");
  return {
    status: "error",
    error: {
      code,
      message,
    },
  };
}

module.exports = createErrorResponse;
