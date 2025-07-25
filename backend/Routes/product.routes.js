const express = require("express");
const {
  createProduct,
  getAllProducts,
} = require("../controller/product.controller");

const router = express.Router();

router.get("/", getAllProducts);
router.post("/", createProduct);

module.exports = router;
