const express = require('express');
const router = express.Router();
const { receiveSensorData, getSensorData } = require('../controllers/sensorController');

router.post('/', receiveSensorData);
router.get('/:meterId', getSensorData);

module.exports = router;
