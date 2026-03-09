const User = require('../models/User');
const Alert = require('../models/Alert');
const Report = require('../models/Report');

exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ meterId: req.user.meterId }).sort({ dateTime: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserReports = async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user._id }).populate('assignedEngineer', 'name').sort({ date: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createReport = async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findById(req.user._id);

    const report = new Report({
      meterId: user.meterId,
      user: user._id,
      zone: user.zone,
      tank: user.tank,
      ward: user.ward,
      reason
    });

    await report.save();

    // Notify Admin
    req.app.get('io').to('Admin').emit('newReport', report);

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
