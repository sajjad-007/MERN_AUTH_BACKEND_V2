const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { configDotenv } = require('dotenv');
const { errorMiddleware } = require('./middleware/error');
const allRoutes = require('./routes/user.apiRoutes');
const fileUpload = require('express-fileupload');
configDotenv({ path: './config/config.env' });

app.use(
  cors({
    origin: 'http://localhosat:5173',
    credentials: true,
    methods: ['PUT', 'POST', 'GET', 'DELETE'],
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: './temp/',
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/user', allRoutes);

app.use(errorMiddleware);

module.exports = { app };
