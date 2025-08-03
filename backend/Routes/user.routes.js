const express = require("express");
const {
  userList,
  getUser,
  createUser,
  login,
  register,
  countUsers,
  deleteUser,
} = require("../controller/user.controller");

const router = express.Router();

router.route("/").get(userList).post(createUser);
router.route("/:id").get(getUser).delete(deleteUser);
router.post("/login", login);
router.post("/register", register);
router.get("/get/count", countUsers);
module.exports = router;
