import express from 'express';

import ProductController from '../controllers/product-controller.js';

import auth from '../middleware/auth.js';
import authAdmin from '../middleware/auth-admin.js';

const router = express.Router();

const {
  getProducts,
  addProduct,
  deleteProduct,
  updateProduct,
} = ProductController;

router.route('/products').get(getProducts).post(auth, authAdmin, addProduct);

router
  .route('/products/:id')
  .delete(auth, authAdmin, deleteProduct)
  .put(auth, authAdmin, updateProduct);

export default router;
