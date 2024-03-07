const { db } = require("../../../database/firebase.config");
const { getDocs, collection } = require("firebase/firestore");
const createSuccessResponse = require("../../../utils/createSuccessResponse");

const getAllAdminsAndManagers = async (req, res) => {
  const admins = [];
  const managers = [];
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.accessLevel === 2) {
      admins.push(data);
    } else if (data.accessLevel === 1) {
      managers.push(data);
    }
  });
  res.status(200).json(createSuccessResponse({ admins, managers }));
};

module.exports = getAllAdminsAndManagers;
