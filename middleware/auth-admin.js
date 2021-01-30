import Users from '../models/user-model.js';

const authAdmin = async (req, res, next) => {
  try {
    const user = await Users.findOne({
      _id: req.user.id,
    });

    // Admin => role = 1
    user.role === 0 && res.status(400).json({ msg: 'Admin - Access Denied!' });

    next();
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
};

export default authAdmin;
