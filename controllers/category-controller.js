import Category from '../models/category-model.js';
import Products from '../models/product-model.js';

const CategoryController = {
  getCategories: async (req, res) => {
    try {
      const categories = await Category.find();

      res.json(categories);
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },
  addCategory: async (req, res) => {
    try {
      const { name } = req.body;
      const category = await Category.findOne({ name });

      if (category)
        return res.status(400).json({ msg: 'This category already exists.' });

      const newCategory = new Category({ name });

      await newCategory.save();

      res.json({ msg: 'Catergory added successfully.' });
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const id = req.params.id;

      const products = await Products.findOne({ category: id });
      if (products)
        return res.status(400).json({
          msg: 'Please delete all products under this category.',
        });

      await Category.findByIdAndDelete(id);

      res.json({ msg: 'Catergory deleted successfully.' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateCategory: async (req, res) => {
    try {
      const { name } = req.body;
      await Category.findOneAndUpdate({ _id: req.params.id }, { name });

      res.json({ msg: 'Catergory updated successfully.' });
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },
};

export default CategoryController;
