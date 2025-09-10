const express = require('express');
const {
  register,
  verifyOtp,
  login,
  forgotPassword,
} = require('../controller/userController');
const router = express.Router();

router.post('/register', register);
router.post('/otp-verify', verifyOtp);
router.post('/login', login);
router.post('/forgot/password', forgotPassword);

module.exports = router;
