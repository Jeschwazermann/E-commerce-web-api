const express = require("express");
const {
  createProduct,
  productList,
  getProduct,
  updateProduct,
  deleteProduct,
  countProducts,
  featuredProducts,
} = require("../controller/product.controller");

const router = express.Router();

router.route("/").get(productList).post(createProduct);
router.route("/:id").get(getProduct).patch(updateProduct).delete(deleteProduct);
router.get("/get/count", countProducts);
router.get("/get/featured", featuredProducts);
module.exports = router;
