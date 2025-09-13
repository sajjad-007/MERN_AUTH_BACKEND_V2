const { User } = require('../model/userSchema');
const { catchAsyncError } = require('./asyncError');
const { ErrorHandler } = require('./error');
const jwt = require('jsonwebtoken');
const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler('User is not Authenticated!', 401));
  }
  const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRECT);
  if (!decoded) {
    return next(new ErrorHandler("couldn't verify the user!", 401));
  }
  req.user = await User.findById(decoded.id);
  if (!req.user) {
    return next(new ErrorHandler('User is not Found', 401));
  }
  next();
});

module.exports = { isAuthenticated };
