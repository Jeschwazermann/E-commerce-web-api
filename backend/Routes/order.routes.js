const {
  orderList,
  createOrder,
  updateOrder,
  deleteOrder,
  orderCount,
  getOrder,
  userOrderList,
} = require("../controller/order.controller");
const express = require("express");

const router = express.Router();

router.route("/").get(orderList).post(createOrder);
router.route("/:id").get(getOrder).patch(updateOrder);
router.delete("/:id", deleteOrder);
//router.post("/");
router.get("/get/totalsales");
router.get("/get/count", orderCount);
router.get("/get/usersorders/:userid", userOrderList);
module.exports = router;
