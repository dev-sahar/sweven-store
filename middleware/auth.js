import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization');

    !token && res.status(400).json({ msg: 'Invalid Authentication!' });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
      error && res.status(400).json({ msg: 'Invalid Authentication!' });

      req.user = user;

      next();
    });
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
};

export default auth;
