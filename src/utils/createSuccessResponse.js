/**
 * A successful response looks like:
 *
 * {
 *   "status": "ok",
 *   ...
 * }
 */

module.exports.createSuccessResponse = function (data) {
  logger.debug({ data }, "createSuccessResponse");
  return {
    status: "ok",
    ...data,
  };
};
