const express = require('express');
const { register, verifyOtp, login } = require('../controller/userController');
const router = express.Router();

router.post('/register', register);
router.post('/otp-verify', verifyOtp);
router.post('/login', login);

module.exports = router;
