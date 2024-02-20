// Desc: Helper function to verify if a string is not empty
const verifyString = (str) => {
  if (
    str === undefined ||
    str === null ||
    !typeof str == "string" ||
    str.trim() === ""
  ) {
    return false;
  }
  return true;
};

module.exports = verifyString;
