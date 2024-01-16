module.exports.createSuccessResponse = function (data) {
    return {
        status: "ok",
        ...data, //I can't believe this is a real operator (spread)
    };
};
module.exports.createErrorResponse = function (code, message) {
    return {
        status: "error",
        error: {
        code: code,
        message: message,
        },
    };
};
