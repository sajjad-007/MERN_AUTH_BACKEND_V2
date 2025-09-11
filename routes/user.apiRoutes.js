const express = require('express');
const {
  register,
  verifyOtp,
  login,
  forgotPassword,
  resetPassword,
} = require('../controller/userController');
const router = express.Router();

router.post('/register', register);
router.post('/otp-verify', verifyOtp);
router.post('/login', login);
router.post('/forgot/password', forgotPassword);
router.post('/reset/password/:token', resetPassword);

module.exports = router;
