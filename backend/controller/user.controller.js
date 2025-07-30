const User = require("../models/user.model");

async function userList(req, res) {
  try {
    const getAllUsers = await User.find();
    res.status(200).json(getAllUsers);
  } catch (error) {
    console.log("error in users controller:", error.message);
    res.status(500).json({ error: "Failed to list all users" });
  }
}

module.exports = {
  userList,
};
