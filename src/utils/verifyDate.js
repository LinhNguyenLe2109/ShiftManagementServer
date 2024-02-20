// Check if the date is valid
const verifyDate = (date) => {
  if (!date) return false;
  const dateObj = new Date(date);
  return !isNaN(dateObj.getTime());
};

module.exports = verifyDate;
