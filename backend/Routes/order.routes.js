const { orderList } = require("../controller/order.controller");
const express = require("express");

const router = express.Router();

router.get("/", orderList);
//router.post("/");

module.exports = router;
