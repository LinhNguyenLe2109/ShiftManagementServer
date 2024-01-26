const logger = require("../../../logger");
const { collection, getDocs } = require("firebase/firestore");
const {db} = require("../../../database/firebase.config");

const getUsers = async (req, res) => {
  try {
    res.setHeader("Cache-Control", "no-cache");
    const usersCol = collection(db, "users");
    const userSnapshot = await getDocs(usersCol);
    const userList = userSnapshot.docs.map((doc) => doc.data());
    logger.info(userList);
    await res.json(userList);
  } catch (err) {
    logger.error(err);
  }
};

module.exports = getUsers;
