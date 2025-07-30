const {
  categoryList,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controller/category.controller");
const express = require("express");

const router = express.Router();

router.route("/").get(categoryList).post(createCategory);
router
  .route("/:id")
  .get(getCategory)
  .patch(updateCategory)
  .delete(deleteCategory);

module.exports = router;
