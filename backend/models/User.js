const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, default: 'User' },
  meterId: { type: String, required: true, unique: true },
  zone: { type: String },
  tank: { type: String },
  ward: { type: String }
});

module.exports = mongoose.model('User', UserSchema);
