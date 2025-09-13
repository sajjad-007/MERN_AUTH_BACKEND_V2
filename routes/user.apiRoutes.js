const express = require('express');
const {
  register,
  verifyOtp,
  login,
  forgotPassword,
  resetPassword,
  logOut,
  getUser,
} = require('../controller/userController');
const { isAuthenticated } = require('../middleware/isUserAuthenticated');
const router = express.Router();

router.post('/register', register);
router.post('/otp-verify', verifyOtp);
router.post('/login', login);
router.post('/logout', isAuthenticated, logOut);
router.get('/getuser', isAuthenticated, getUser);
router.post('/forgot/password', forgotPassword);
router.post('/reset/password/:token', resetPassword);

module.exports = router;
