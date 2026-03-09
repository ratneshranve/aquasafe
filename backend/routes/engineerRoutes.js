const express = require('express');
const router = express.Router();
const { getEngineerDashboard, getActiveTasks, getResolvedTasks, updateStatus } = require('../controllers/engineerController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/dashboard', getEngineerDashboard);
router.get('/tasks/active', getActiveTasks);
router.get('/tasks/resolved', getResolvedTasks);
router.post('/tasks/status', updateStatus);

module.exports = router;
