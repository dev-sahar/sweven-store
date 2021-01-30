import Payments from '../models/payment-model.js';
import Users from '../models/user-model.js';
import Products from '../models/product-model.js';

const PaymentController = {
  getPayments: async (req, res) => {
    try {
      const payments = await Payments.find();
      res.json(payments);
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },
  createPayment: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select('name email');
      if (!user) return res.status(400).json({ msg: 'User does not exist.' });

      const { cart, paymentID, address } = req.body;
      const { _id, name, email } = user;

      const newPayment = new Payments({
        user_id: _id,
        name,
        email,
        cart,
        paymentID,
        address,
      });

      cart.filter((item) => {
        return sold(item._id, item.quantity, item.sold);
      });

      await newPayment.save();
      res.json({ msg: 'Payment Successful!' });
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },
};

const sold = async (id, quantity, oldSold) => {
  await Products.findOneAndUpdate(
    { _id: id },
    {
      sold: quantity + oldSold,
    }
  );
};

export default PaymentController;
