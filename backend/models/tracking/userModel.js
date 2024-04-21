import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "Username can't be blank"],
    index: true,
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "Email can't be blank"],
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    index: true,
  },
  password: {
    type: String,
    required: [true, "Password can't be blank"],
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'superadmin'],
    default: 'user',
  },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String },
  },
});

const UserModel = mongoose.model('ParcelUser', userSchema);
export default UserModel;
