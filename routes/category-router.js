import express from 'express';

import CategoryController from '../controllers/category-controller.js';

import auth from '../middleware/auth.js';
import authAdmin from '../middleware/auth-admin.js';

const router = express.Router();

const {
  getCategories,
  addCategory,
  deleteCategory,
  updateCategory,
} = CategoryController;

router.route('/category').get(getCategories).post(auth, authAdmin, addCategory);

router
  .route('/category/:id')
  .delete(auth, authAdmin, deleteCategory)
  .put(auth, authAdmin, updateCategory);

export default router;
