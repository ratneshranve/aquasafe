const mongoose = require('mongoose');

const SensorDataSchema = new mongoose.Schema({
  meterId: { type: String, required: true },
  tds: { type: Number, required: true },
  turbidity: { type: Number, required: true },
  ph: { type: Number, required: true },
  status: { type: String, required: true },
  dateTime: { type: Date, required: true }
});

module.exports = mongoose.model('SensorData', SensorDataSchema);
