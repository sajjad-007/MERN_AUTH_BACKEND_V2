const { app } = require('./app');
const { dbConnect } = require('./database/dbConnection');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'my_cloud_name',
  api_key: 'my_key',
  api_secret: 'my_secret',
});



dbConnect().then(() => {
  app.listen(process.env.PORT, () => {
    console.log('Server is running on Port', process.env.PORT);
  });
});
