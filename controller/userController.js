const { catchAsyncError } = require('../middleware/asyncError');
const { ErrorHandler } = require('../middleware/error');
const { User } = require('../model/userSchema');
const { emailTemplate } = require('../utilis/emailTemplete');
const { sendVerificationEmail } = require('../utilis/nodeMailer');
const cloudinary = require('cloudinary').v2;
const twilio = require('twilio'); // Or, for ESM: import twilio from "twilio";

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// OTP Verification using email or phone number
const userChoosenVerificationMethod = async (
  user,
  email,
  phoneNumber,
  verificationCode,
  accountVerificationMethod,
  res,
  next
) => {
  try {
    if (accountVerificationMethod == 'email') {
      const template = emailTemplate(verificationCode);
      sendVerificationEmail(email, 'Verification email sent!', template);
      res.status(200).json({
        success: true,
        message: `Email sent at ${email}`,
        email,
        phoneNumber,
        user,
      });
    } else if (accountVerificationMethod === 'phone') {
      const verificationCodeWithSpace = verificationCode
        .toString()
        .split('')
        .join(' ');
      const response = client.calls.create({
        // from: process.env.USER_EMAIL,
        to: +8801824750778,
        from: +8801824750778,
        twiml: `<Response> <Say> Your OTP is ${verificationCodeWithSpace}, Your OTP is ${verificationCodeWithSpace} </Say> </Response>`,
      });
      if (!response) {
        return next(new ErrorHandler('Error from twilio', 401));
      }
      res.status(200).json({
        success: true,
        message: 'We will send your OTP through a phone call.',
        user,
      });
    } else {
      console.log('else condition');
      return next(new ErrorHandler('Invalid verification method', 404));
    }
  } catch (error) {
    return next(new ErrorHandler('Error from verification method', 500));
  }
};

// User registration
const register = catchAsyncError(async (req, res, next) => {
  //user input
  const {
    profile,
    fullName,
    email,
    phoneNumber,
    password,
    accountVerificationMethod,
  } = req.body;
  // validation
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler('No file were uploaded!'));
  }
  const { image } = req.files;

  //upload your image into cloudinary
  const cloudinaryResponseForProfileImg = await cloudinary.uploader.upload(
    image.tempFilePath,
    {
      folder: 'AUTH_V2',
    }
  );
  if (
    !cloudinaryResponseForProfileImg ||
    cloudinaryResponseForProfileImg.error
  ) {
    console.error(
      'cloudinary error',
      cloudinaryResponseForProfileImg.error || 'Unknown cloudniray error'
    );
    return next(new ErrorHandler('Image not fuond', 404));
  }

  if (
    !fullName ||
    !email ||
    !phoneNumber ||
    !password ||
    !accountVerificationMethod
  ) {
    return next(new ErrorHandler('Credentials Missing!', 401));
  }
  const phoneNumberValidate = phoneNumber => {
    // only Bangladesh's phone number can verifi their otp through phone number
    const phoneRegx = /^\+880\d{10}$/;
    return phoneRegx.test(phoneNumber);
  };
  if (!phoneNumberValidate(phoneNumber)) {
    return next(new ErrorHandler('Phone Number format Invalid!', 401));
  }
  //find user into database and see is user already register or exist into database
  const isUserAlreadyExist = await User.findOne({
    $or: [
      { email: email, accountVerified: true },
      { phoneNumber: phoneNumber, accountVerified: true },
    ],
  });
  if (isUserAlreadyExist) {
    return next(new ErrorHandler('This Email or Number Already Exist!', 400));
  }

  // if a user tried to register multiple time but failed
  const userTotalAttemptToRegister = await User.find({
    $or: [
      { email: email, accountVerified: false },
      { phoneNumber: phoneNumber, accountVerified: false },
    ],
  });

  if (userTotalAttemptToRegister.length > 3) {
    return next(
      new ErrorHandler(
        "You've just exceded your attempt limit!, plz try half an hour later",
        401
      )
    );
  }

  // Upload Profile profile
  const user = await User.create({
    profile: {
      public_id: cloudinaryResponseForProfileImg.public_id,
      secure_url: cloudinaryResponseForProfileImg.secure_url,
    },
    fullName,
    email,
    phoneNumber,
    password,
    accountVerificationMethod,
  });
  console.log(cloudinaryResponseForProfileImg);
  if (!user) {
    return next(new ErrorHandler("User info couldn't save!", 400));
  }
  const verificationCode = await user.generateVerificationCode();
  await userChoosenVerificationMethod(
    user,
    email,
    phoneNumber,
    verificationCode,
    accountVerificationMethod,
    res,
    next
  );
  user.verificationCode = verificationCode;
  user.verificationCodeExpire = Date.now() * 5 * 60 * 1000;
  user.save();

  console.log('user info saved successfully!');
});

module.exports = { register };
