const Product = require("../models/product.model");

async function createProduct(req, res) {
  try {
    const product = req.body;
    const newProduct = new Product(product);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.log("error in product controller:", error.message);
    res.status(500).json({ error: "Failed to create product" });
  }
}

async function getAllProducts(req, res) {
  try {
    const productList = await Product.find();
    res.status(200).json({ success: true, data: productList });
  } catch (error) {
    console.log("error in product controller:", error.message);
    res.status(500).json({ error: "Failed to list products" });
  }
}

module.exports = {
  createProduct,
  getAllProducts,
};
