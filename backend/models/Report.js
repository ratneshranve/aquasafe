const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  meterId: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  zone: { type: String },
  tank: { type: String },
  ward: { type: String },
  reason: { type: String, required: true },
  status: { type: String, default: 'Pending' }, // Pending, Resolved
  assignedEngineer: { type: mongoose.Schema.Types.ObjectId, ref: 'Engineer' },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', ReportSchema);
