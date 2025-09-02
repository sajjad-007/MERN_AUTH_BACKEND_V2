class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || 'Internal Server Error';
  err.statusCode = err.statusCode || 500;

  if (err.name === 'CastError') {
    const message = `Invalid ${err.path}`;
    err = new ErrorHandler(message, 401);
  }
  if (err.name === 'JsonWebTokenError') {
    const message = `Invalid JsonWeb Token!`;
    err = new ErrorHandler(message, 401);
  }
  if (err.name === 'TokenExpiredError') {
    const message = `JsonWeb Token Expire!`;
    err = new ErrorHandler(message, 401);
  }
  if (err.name === 11000) {
    const message = `Duplicates ${Object.keys(err.keyValue)} Enterd!`;
    err = new ErrorHandler(message, 401);
  }

  const errMessage = err.errors
    ? Object.values(err.errors)
        .map(error => error.message)
        .join('')
    : err.message;

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

module.exports = { ErrorHandler, errorMiddleware };
