const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = new Schema(
  {
    image: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
      Selection: false,
    },
    accountVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: String,
    verificationCodeExpire: String,
    accountVerificationMethod: String,
    resetVerificationToken: String,
    verificationTokenEXpire: String,
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified === this.password) {
    next();
  }
  const hassPass = await bcrypt.hash(this.password, 10);
  this.password = hassPass;
  return;
});

userSchema.methods.compareHashPassword = async function (userEnteredPassword) {
  return await bcrypt.compare(userEnteredPassword, this.password);
};

userSchema.methods.generateToken = function () {
  const token = crypto.randomBytes(20).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const mytoken = jwt.sign(tokenHash, process.env.JWT_TOKEN_SECRECT, {
    expiresIn: process.env.JWT_TOKEN_EXPIRES,
  });
  return tokenHash;
};

userSchema.methods.generateVerificationCode = async function () {
  // always generate five digits number in every case
  const fiveDigitNumbers = Math.floor(Math.random() * 90000) + 10000;
  return fiveDigitNumbers;
};

const User = mongoose.model('user', userSchema);
module.exports = { User };
