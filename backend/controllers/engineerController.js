const Report = require('../models/Report');
const Engineer = require('../models/Engineer');

exports.getEngineerDashboard = async (req, res) => {
  try {
    const engineer = await Engineer.findById(req.user._id);
    res.json(engineer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getActiveTasks = async (req, res) => {
  try {
    const tasks = await Report.find({ assignedEngineer: req.user._id, status: { $ne: 'Resolved' } }).populate('user', 'name phone meterId');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getResolvedTasks = async (req, res) => {
  try {
    const tasks = await Report.find({ assignedEngineer: req.user._id, status: 'Resolved' }).populate('user', 'name phone meterId');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { reportId, status } = req.body;
    const report = await Report.findOne({ _id: reportId, assignedEngineer: req.user._id });
    
    if (!report) return res.status(404).json({ message: 'Report not found' });
    
    report.status = status;
    await report.save();

    // Notify User
    if (status === 'Resolved' && report.user) {
      req.app.get('io').to(report.user.toString()).emit('reportResolved', report);
    }
    
    res.json({ message: 'Task status updated', report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
