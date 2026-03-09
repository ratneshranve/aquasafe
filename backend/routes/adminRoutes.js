const express = require('express');
const router = express.Router();
const { getDashboardData, getUsers, addUser, deleteUser, getEngineers, addEngineer, deleteEngineer, getAllReports, getAssignedTasks, getResolvedReports, assignEngineer, getAllAlerts, assignEngineerToAlert } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect, admin);

router.get('/dashboard', getDashboardData);

// Users
router.route('/users')
  .get(getUsers)
  .post(addUser);

router.delete('/users/:id', deleteUser);

// Engineers
router.route('/engineers')
  .get(getEngineers)
  .post(addEngineer);

router.delete('/engineers/:id', deleteEngineer);

// Reports
router.get('/reports', getAllReports);
router.get('/reports/assigned', getAssignedTasks);
router.get('/reports/resolved', getResolvedReports);
router.post('/reports/assign', assignEngineer);

// Alerts
router.get('/alerts', getAllAlerts);
router.post('/alerts/assign', assignEngineerToAlert);

module.exports = router;
