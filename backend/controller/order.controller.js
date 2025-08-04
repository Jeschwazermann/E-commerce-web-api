const OrderItem = require("../models/order-item.model");
const Order = require("../models/order.model");

async function orderList(req, res) {
  try {
    const getAllOrders = await Order.find()
      .populate("user", "name")
      .sort({ dateOrdered: -1 });
    res.status(200).json(getAllOrders);
  } catch (error) {
    console.log("error in users controller:", error.message);
    res.status(500).json({ error: "Failed to list all orders" });
  }
}
async function createOrder(req, res) {
  try {
    const orderItemsIds = await Promise.all(
      req.body.orderItems.map(async (orderItem) => {
        let newOrderItem = new OrderItem({
          quantity: orderItem.quantity,
          product: orderItem.product,
        });

        const savedOrderItem = await newOrderItem.save();

        return savedOrderItem._id;
      })
    );
    const orderItemsIdsResolved = orderItemsIds;
    const totalPrices = await Promise.all(
      orderItemsIdsResolved.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate(
          "product",
          "price"
        );
        const totalPrice = (orderItem.product.price = orderItem.quantity);
        return totalPrice;
      })
    );

    const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

    console.log(totalPrices);

    const {
      shippingAddress1,
      shippingAddress2,
      city,
      zip,
      country,
      phone,
      status,
      user,
    } = req.body;
    const newOrder = new Order({
      orderItems: orderItemsIdsResolved,
      shippingAddress1,
      shippingAddress2,
      city,
      zip,
      country,
      phone,
      status,
      totalPrice: totalPrice,
      user,
    });
    const savedOrder = await newOrder.save();
    return res.status(201).json(savedOrder);
  } catch (error) {
    console.log("error in order controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getOrder(req, res) {
  try {
    const { id } = req.params;
    const order = await Product.findById(id)
      .populate("user", "name")
      .populate({
        path: "orderItems",
        populate: { path: "product", populate: "category" },
      });
    if (!order) {
      return res.status(404).json({ message: `Order with ID ${id} not found` });
    }
    res.status(200).json(order);
  } catch (error) {
    console.log("Error in getOrder Controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function updateOrder(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findById(id);
    if (order) {
      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
      return res.status(200).json(updatedOrder);
    } else {
      return res.status(400).json({ message: `order cannot be updated` });
    }
  } catch (error) {
    console.log("Error in updateOrder Controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function deleteOrder(req, res) {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (order) {
      await Promise.all(
        order.orderItems.map(async (orderItem) => {
          await orderItem.findByIdAndDelete(orderItem);
        })
      );

      await Order.findByIdAndDelete(id);
      return res
        .status(200)
        .json({ message: `Order with ID ${id} deleted successfully` });
    } else {
      return res.status(404).json({ message: `Order with ID ${id} found` });
    }
  } catch (error) {
    console.log("Error in deleteOrder Controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function totalOrderSales(req, res) {
  try {
    const getTotalOrders = await Order.aggregate([
      { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
    ]);
    if (!getTotalOrders) {
      return res
        .status(400)
        .json({ message: "The order sales cannot be generated" });
    }
    res
      .status(200)
      .json({ totalOrderSales: totalOrderSales.pop().totalOrderSales });
  } catch (error) {
    console.log("Error in totalOrderSales Controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function orderCount(req, res) {
  try {
    const count = await Order.countDocuments();
    res.status(200).json({ orderscount: count });
  } catch (error) {
    console.log("error in orderCount controller", error.message);
    res.status(500).json({ error: "Internal Serval error" });
  }
}

async function userOrderList(req, res) {
  try {
    const getAllOrders = await Order.find({ user: req.params.userId })
      .populate({
        path: "orderItems",
        populate: { path: "product", populate: "category" },
      })
      .sort({ dateOrdered: -1 });
    res.status(200).json(getAllOrders);
  } catch (error) {
    console.log("error in users controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}
module.exports = {
  orderList,
  createOrder,
  getOrder,
  updateOrder,
  deleteOrder,
  totalOrderSales,
  orderCount,
  userOrderList,
};
