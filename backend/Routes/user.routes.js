const express = require("express");
const { userList } = require("../controller/user.controller");

const router = express.Router();

router.get("/", userList);
//router.post("/");

module.exports = router;
