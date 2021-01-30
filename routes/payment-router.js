import express from 'express';

import PaymentController from '../controllers/payment-controller.js';

import auth from '../middleware/auth.js';
import authAdmin from '../middleware/auth-admin.js';

const router = express.Router();

const { getPayments, createPayment } = PaymentController;

router
  .route('/payment')
  .get(auth, authAdmin, getPayments)
  .post(auth, createPayment);

export default router;
