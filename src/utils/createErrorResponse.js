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
module.exports.createErrorResponse = function (code, message) {
    logger.debug({ code, message }, 'createErrorResponse');
    return {
      status: 'error',
      error: {
        code,
        message,
      },
    };
  };
  