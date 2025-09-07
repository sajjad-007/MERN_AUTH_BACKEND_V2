const express = require('express');
const { register, verifyOtp } = require('../controller/userController');
const router = express.Router();

router.post('/register', register);
router.post('/otp-verify', verifyOtp);

module.exports = router;
