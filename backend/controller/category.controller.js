const Category = require("../models/category.model");

async function categoryList(req, res) {
  try {
    const getAllCategories = await Category.find();
    res.status(200).json(getAllCategories);
  } catch (error) {
    console.log("error in users controller:", error.message);
    res.status(500).json({ error: "Failed to list all categories" });
  }
}
async function createCategory(req, res) {
  try {
    const category = req.body;
    const newCategory = new Category(category);
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    console.log("error in category controller:", error.message);
    res.status(500).json({ error: "the category cannot be created" });
  }
}

async function getCategory(req, res) {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res
        .status(404)
        .json({ message: `Category with ID ${id} not found` });
    }
    res.status(200).json(category);
  } catch (error) {
    console.log("Error in getCategory Controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { name, icon, color } = req.body;
    const category = await Category.findById(id);
    if (category) {
      const updatedCategory = await Category.findByIdAndUpdate(
        id,
        { name, icon, color },
        { new: true }
      );
      return res.status(200).json(updatedCategory);
    } else {
      return res.status(400).json({ message: `category cannot be updated` });
    }
  } catch (error) {
    console.log("Error in updateCategory Controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function deleteCategory(req, res) {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: `Category with ID ${id} found` });
    }
    res
      .status(200)
      .json({ message: `Category with ID ${id} deleted successfully` });
  } catch (error) {
    console.lo("Error in deleteCategory Controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
module.exports = {
  categoryList,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
};
