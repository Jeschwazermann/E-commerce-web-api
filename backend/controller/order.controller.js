const Order = require("../models/order.model");

async function orderList(req, res) {
  try {
    const getAllOrders = await Order.find();
    res.status(200).json(getAllOrders);
  } catch (error) {
    console.log("error in users controller:", error.message);
    res.status(500).json({ error: "Failed to list all orders" });
  }
}

module.exports = {
  orderList,
};
