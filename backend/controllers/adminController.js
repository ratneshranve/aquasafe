const User = require('../models/User');
const Engineer = require('../models/Engineer');
const Report = require('../models/Report');
const Alert = require('../models/Alert');
const bcrypt = require('bcryptjs');

// Dashboard Map Data
exports.getDashboardData = async (req, res) => {
  try {
    const alerts = await Alert.find();
    
    // Group alerts by zone
    const zoneStatus = {};
    for(let i=1; i<=19; i++) zoneStatus[`Z-${i}`] = 'Green';

    alerts.forEach(alert => {
      const { zone } = alert;
      // Depending on severity, we could mark Yellow or Red.
      // E.g., recent alerts in 24h = Red, otherwise Yellow, here just set to Red if alert exists.
      if (zone) {
        zoneStatus[zone] = 'Red';
      }
    });

    res.json(zoneStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addUser = async (req, res) => {
  try {
    const { name, email, password, phone, meterId, zone, tank, ward } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      name, email, password: hashedPassword, phone, meterId, zone, tank, ward
    });
    
    await user.save();
    res.status(201).json({ message: 'User added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Engineers
exports.getEngineers = async (req, res) => {
  try {
    const engineers = await Engineer.find().select('-password');
    res.json(engineers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addEngineer = async (req, res) => {
  try {
    const { name, email, password, phone, zone } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const engineer = new Engineer({
      name, email, password: hashedPassword, phone, zone
    });
    
    await engineer.save();
    res.status(201).json({ message: 'Engineer added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteEngineer = async (req, res) => {
  try {
    await Engineer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Engineer deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reports
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find({ assignedEngineer: null, status: { $ne: 'Resolved' } }).populate('user', 'name phone meterId');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAssignedTasks = async (req, res) => {
  try {
    const reports = await Report.find({ assignedEngineer: { $ne: null }, status: { $ne: 'Resolved' } })
      .populate('user', 'name phone meterId')
      .populate('assignedEngineer', 'name email zone');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getResolvedReports = async (req, res) => {
  try {
    const reports = await Report.find({ status: 'Resolved' })
      .populate('user', 'name phone meterId')
      .populate('assignedEngineer', 'name email zone');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.assignEngineer = async (req, res) => {
  try {
    const { reportId, engineerId } = req.body;
    const report = await Report.findById(reportId);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    
    report.assignedEngineer = engineerId;
    await report.save();

    req.app.get('io').to('Engineer').emit('taskAssigned', report); // simplistic

    res.json({ message: 'Engineer assigned successfully', report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Alerts
exports.getAllAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find().populate('user', 'name phone').populate('assignedEngineer', 'name').sort({ dateTime: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.assignEngineerToAlert = async (req, res) => {
  try {
    const { alertId, engineerId } = req.body;
    const alert = await Alert.findById(alertId);
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
    
    // Assign engineer to alert
    alert.assignedEngineer = engineerId;
    await alert.save();

    // Create a new Report directly assigned to the engineer
    const newReport = new Report({
      meterId: alert.meterId,
      user: alert.user,
      zone: alert.zone,
      tank: alert.tank,
      ward: alert.ward,
      reason: 'SYSTEM ALERT: ' + alert.reason,
      status: 'Pending',
      assignedEngineer: engineerId
    });
    
    await newReport.save();

    req.app.get('io').to('Engineer').emit('taskAssigned', newReport);

    res.json({ message: 'Engineer assigned to alert successfully', alert });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
