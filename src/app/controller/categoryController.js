const Category = require("../models/category");

class CategoryController {
  index(req, res) {
    res.send("Hello from category");
  }
  async createCategory(req, res, next) {
    const newCategory = new Category(req.body);
    try {
      const savedCategory = await newCategory.save();
      res.status(200).json(savedCategory);
    } catch (err) {
      next(err);
    }
  }
  async updateCategory(req, res, next) {
    try {
      const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedCategory);
    } catch (err) {
      next(err);
    }
  }

  async deleteCategory(req, res, next) {
    try {
      const deletedCategory = await Category.findByIdAndDelete(req.params.id);
      res.status(200).json("Category has been deleted");
    } catch (err) {
      next(err);
    }
  }

  async getCategory(req, res, next) {
    try {
      const Category = await Category.findById(req.params.id);
      res.status(200).json(Category);
    } catch (err) {
      next(err);
    }
  }

  async getAllCategory(req, res, next) {
    try {
      const Categories = await Category.find();
      res.status(200).json(Categories);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CategoryController();
