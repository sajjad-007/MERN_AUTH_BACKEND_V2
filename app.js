const express = require('express');

const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { configDotenv } = require('dotenv');


configDotenv({ path: './config/config.env' });

app.use(
  cors({
    origin: 'http://localhosat:5173',
    credentials: true,
    methods: ['PUT', 'POST', 'GET', 'DELETE'],
  })
);

app.use(cookieParser());
app.use(express.urlencoded({}));


module.exports = { app };
