const mongoose = require("mongoose");
const Product = require("../models/product.model");
const Category = require("../models/category.model");

async function createProduct(req, res) {
  try {
    const product = req.body;
    console.log("Received product body:", product);

    if (!product.category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const category = await Category.findById(product.category);
    if (!category) {
      return res.status(400).json({ message: "Invalid Category" });
    }

    const newProduct = new Product(product);
    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error in product controller:", error.message);
    res.status(500).json({ error: "Failed to create product" });
  }
}

async function productList(req, res) {
  try {
    // const getAllProducts = await Product.find().select("name -_id");
    let filter = {};
    if (req.query.categories) {
      filter = { category: req.query.categories.split(",") };
    }
    const getAllProducts = await Product.find(filter).populate("category");
    res.status(200).json(getAllProducts);
  } catch (error) {
    console.log("error in product controller:", error.message);
    res.status(500).json({ error: "Failed to list products" });
  }
}

async function getProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate("category");
    if (!product) {
      return res
        .status(404)
        .json({ message: `Product with ID ${id} not found` });
    }
    res.status(200).json(product);
  } catch (error) {
    console.log("Error in getProduct Controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function updateProduct(req, res) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid Product ID" });
  }
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }
    const category = await Category.findById(product.category);
    if (!category) {
      return res.status(400).json({ message: "Invalid Category" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.log("Error in updateProduct Controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await Category.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: `Product with ID ${id} found` });
    }
    res
      .status(200)
      .json({ message: `Product with ID ${id} deleted successfully` });
  } catch (error) {
    console.log("Error in deleteProduct Controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function countProducts(req, res) {
  try {
    const count = await Product.countDocuments();
    res.status(200).json({ productCount: count });
  } catch (error) {
    console.log("error counting products", error.message);
    res.status(500).json({ error: "Internal Serval error" });
  }
}

async function featuredProducts(req, res) {
  try {
    const count = req.params.count ? req.params.count : 0;
    const featured = await Product.find({ isFeatured: true }).limit(+count);
    res.status(200).json({ featuredProducts: featured });
  } catch (error) {}
  console.log("error getting featured Products");
  res.status(500).json({ error: "Internal server error" });
}

module.exports = {
  createProduct,
  productList,
  getProduct,
  updateProduct,
  deleteProduct,
  countProducts,
  featuredProducts,
};
