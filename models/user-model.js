import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: 0,
    },
    cart: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Users', UserSchema);
