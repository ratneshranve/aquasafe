const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  meterId: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  zone: { type: String },
  tank: { type: String },
  ward: { type: String },
  tds: { type: Number },
  turbidity: { type: Number },
  ph: { type: Number },
  reason: { type: String },
  assignedEngineer: { type: mongoose.Schema.Types.ObjectId, ref: 'Engineer' },
  dateTime: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alert', AlertSchema);
