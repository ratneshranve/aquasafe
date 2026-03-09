const express = require('express');
const router = express.Router();
const { getUserDetails, getUserAlerts, getUserReports, createReport } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/me', getUserDetails);
router.get('/alerts', getUserAlerts);
router.get('/reports', getUserReports);
router.post('/reports', createReport);

module.exports = router;
