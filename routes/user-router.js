import express from 'express';

import UserController from '../controllers/user-controller.js';

import auth from '../middleware/auth.js';

const router = express.Router();

const {
  register,
  refreshToken,
  signin,
  signout,
  getUser,
  addToCart,
  history,
} = UserController;

router.post('/register', register);
router.post('/signin', signin);

router.get('/signout', signout);
router.get('/refresh_token', refreshToken);
router.get('/info', auth, getUser);
router.get('/history', auth, history);

router.patch('/addtocart', auth, addToCart);

export default router;
