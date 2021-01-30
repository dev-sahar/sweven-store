import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import Users from '../models/user-model.js';
import Payments from '../models/payment-model.js';

const UserController = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // Email Validation
      const user = await Users.findOne({ email });
      if (user) return res.status(400).json({ msg: 'Email already exists!' });

      // Password Validation
      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: 'Password should be at least 6 characters long.' });

      // Password Encryption
      const passwordHash = await bcrypt.hash(password, 10);

      const newUser = new Users({
        name,
        email,
        password: passwordHash,
      });

      // Save to MongoDB
      await newUser.save();

      // Create jsonwebtoken 'jwt' for Authentication
      const accesstoken = createAccessToken({ id: newUser._id });
      const refreshtoken = createRefreshToken({ id: newUser._id });

      res.cookie('refreshtoken', refreshtoken, {
        httpOnly: true,
        path: '/user/refresh_token',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ accesstoken });
      //res.json({ msg: 'Registered Successfully.' });
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },
  signin: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate Login Credentials
      const user = await Users.findOne({ email });
      if (!user) return res.status(400).json({ msg: 'User does not exist.' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: 'Wrong password.' });

      // Create Access & Refresh Tokens
      const accesstoken = createAccessToken({ id: user._id });
      const refreshtoken = createRefreshToken({ id: user._id });

      res.cookie('refreshtoken', refreshtoken, {
        httpOnly: true,
        path: '/user/refresh_token',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ accesstoken });
      //res.json({ msg: 'Signed In Successfully.' });
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },
  signout: async (req, res) => {
    try {
      res.clearCookie('refreshtoken', { path: '/user/refresh_token' });
      return res.json({ msg: 'Signed Out' });
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },
  refreshToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;

      if (!rf_token)
        return res.status(400).json({ msg: 'Please sign in or Register!' });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
        if (error)
          return res.status(400).json({ msg: 'Please sign in or Register!' });

        const accesstoken = createAccessToken({ id: user.id });

        res.json({ accesstoken });
      });
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },
  getUser: async (req, res) => {
    try {
      const id = req.user.id;
      const user = await Users.findById(id).select('-password');

      if (!user) return res.status(400).json({ msg: 'User does not exist.' });

      res.json(user);
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },
  addToCart: async (req, res) => {
    try {
      const id = req.user.id;
      const user = await Users.findById(id);

      if (!user) return res.status(400).json({ msg: 'User does not exist.' });

      await Users.findOneAndUpdate(
        { _id: id },
        {
          cart: req.body.cart,
        }
      );

      return res.json({ msg: 'Item added to cart.' });
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },
  history: async (req, res) => {
    try {
      const id = req.user.id;
      const history = await Payments.find({ user_id: id });

      res.json(history);
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },
};

const createAccessToken = (user) =>
  jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '11m' });

const createRefreshToken = (user) =>
  jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

export default UserController;
