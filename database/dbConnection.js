const mongoose = require('mongoose');
const { ErrorHandler } = require('../middleware/error');
const dbConnect = async (req, res, next) => {
  try {
    const connectingToDB = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'AUTHV2',
    });
    if (!connectingToDB) {
      return next(new ErrorHandler('database connection failed', 401));
    }
    console.log('Database Connection Successfull!');
  } catch (error) {
    console.error('Error from DB Connecting', error);
    return next(new ErrorHandler('database connection error', 500));
  }
};

module.exports = { dbConnect };
