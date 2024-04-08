const verifyNumber = (num) => {
  if (num === null || num === undefined || typeof num !== "number") {
    return false;
  }
  return true;
};

module.exports = verifyNumber;
