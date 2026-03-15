const SensorData = require('../models/SensorData');
const Alert = require('../models/Alert');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

exports.receiveSensorData = async (req, res) => {
  try {
    const { meterId, tds, turbidity, ph, dateTime } = req.body;
    const io = req.app.get('io'); // get socket.io instance

    let status = 'safe';
    let reasons = [];

    if (tds > 500) reasons.push('High TDS');
    if (turbidity > 5) reasons.push('High Turbidity');
    if (ph < 6.5 || ph > 8.5) reasons.push('Abnormal pH');

    if (reasons.length > 0) {
      status = 'unsafe';
    }

    // Save Sensor Data
    const sensorData = new SensorData({
      meterId,
      tds,
      turbidity,
      ph,
      status,
      dateTime: dateTime || Date.now()
    });

    await sensorData.save();

    // If unsafe, generate alert
    if (status === 'unsafe') {
      const user = await User.findOne({ meterId });
      
      const newAlert = new Alert({
        meterId,
        user: user ? user._id : null,
        zone: user ? user.zone : 'Unknown',
        tank: user ? user.tank : 'Unknown',
        ward: user ? user.ward : 'Unknown',
        tds,
        turbidity,
        ph,
        reason: reasons.join(', '),
        dateTime: dateTime || Date.now()
      });

      await newAlert.save();
      await newAlert.populate('user');

      // Emit to Admin
      io.to('Admin').emit('newAlert', newAlert);
      
      // Emit to specific User if exists & Send Email
      if (user) {
        io.to(user._id.toString()).emit('newAlert', newAlert);
        
        // Send Email Notification
        const message = `
URGENT: Water Quality Alert

Dear ${user.name},

The AquaSafe system has detected potentially unsafe water quality at your residence.

Meter ID: ${meterId}
Location: Zone ${user.zone}, Tank ${user.tank}, Ward ${user.ward}

Detected Abnormalities:
- TDS: ${tds}
- Turbidity: ${turbidity}
- pH: ${ph}

Reason for Alert: ${reasons.join(', ')}

Please take precaution and avoid drinking the water until an engineer investigates.
A formal task has been automatically logged with the AquaSafe authority.

Stay Safe,
The AquaSafe Team`;

        await sendEmail({
          email: user.email,
          subject: 'URGENT: Water Quality Alert - AquaSafe',
          message: message
        });
      }
    }

    res.status(201).json({ message: 'Sensor data recorded', status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSensorData = async (req, res) => {
  try {
    const { meterId } = req.params;
    const data = await SensorData.find({ meterId }).sort({ dateTime: -1 }).limit(10);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
