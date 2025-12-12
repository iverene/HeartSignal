const express = require('express');
const router = express.Router();
// Import all three functions
const { updateLocation, getNearbyUsers, updateFcmToken } = require('../controllers/userController');

router.post('/location', updateLocation);       
router.get('/nearby', getNearbyUsers);          
router.post('/fcm-token', updateFcmToken); // <--- ADDED THIS LINE

module.exports = router;