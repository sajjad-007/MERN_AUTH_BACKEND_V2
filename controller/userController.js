const { catchAsyncError } = require('../middleware/asyncError');
const { ErrorHandler } = require('../middleware/error');
const { User } = require('../model/userSchema');

const register = catchAsyncError(async (req, res, next) => {
  //user input
  const {
    image,
    fullName,
    email,
    phoneNumber,
    password,
    accountVerificationMethod,
  } = req.body;
  // validation
  if (
    !image ||
    !fullName ||
    !email ||
    !phoneNumber ||
    !password ||
    !accountVerificationMethod
  ) {
    return next(new ErrorHandler('Credentials Missing!', 401));
  }
  //save user on database
  const isExistingUser = await User.find({
    $or: [
      { email: email, accountVerified: false },
      { phoneNumber: phoneNumber, accountVerified: false },
    ],
  });
  if (isExistingUser.length > 3) {
    return next(
      new ErrorHandler(
        "You've just exceded your attempt limit!, plz try half an hour later",
        401
      )
    );
  }
  // ? this my comment
  // *this is my comment
  //todo  hello
  let user;
  if (isExistingUser.length > 0) {
    const nweuser = await User.deleteMany({
      $or: [
        { email: email, accountVerified: false },
        { phoneNumber: phoneNumber, accountVerified: false },
        { $gt: { creadeAt: -1 } },
      ],
    //   $ne:[ $gt: {createdAt:-1}]
    });
  }
  const usersss = await User.create({
    image,
    fullName,
    email,
    phoneNumber,
    password,
    accountVerificationMethod,
  });
  if (!usersss) {
    return next(new ErrorHandler("User info couldn't save!", 400));
  }
  res.status(200).json({
    success: true,
    message: 'success',
  });
  console.log('user saved successfully!');
});

module.exports = { register };
