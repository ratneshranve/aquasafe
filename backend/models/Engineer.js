const mongoose = require('mongoose');

const EngineerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  zone: { type: String, required: true },
  role: { type: String, default: 'Engineer' }
});

module.exports = mongoose.model('Engineer', EngineerSchema);
