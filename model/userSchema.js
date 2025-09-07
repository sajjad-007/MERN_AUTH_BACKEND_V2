const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = new Schema(
  {
    profile: {
      public_id: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
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
      // select: false,
    },
    accountVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: String,
    verificationCodeExpire: String,
    accountVerificationMethod: String,
    resetVerificationToken: String,
    resetVerificationTokenEXpire: String,
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified === this.password) {
    next();
  }
  const hassPass = await bcrypt.hash(this.password, 10);
  return this.password = hassPass;
});

userSchema.methods.compareHashPassword = async function (userEnteredPassword) {
  return await bcrypt.compare(userEnteredPassword, this.password);
};

userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_TOKEN_SECRECT, {
    expiresIn: '5d',
  });
};

userSchema.methods.generateResetToken = function () {
  const token = crypto.randomBytes(20).toString('hex');
  const resetTokenHash = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  this.resetVerificationToken = resetTokenHash;
  this.resetVerificationTokenEXpire = Date.now() + 20 * 60 * 1000;
  return token;
};

userSchema.methods.generateVerificationCode = async function () {
  // always generate five digits number in every case
  const fiveDigitNumbers = Math.floor(Math.random() * 90000) + 10000;
  return fiveDigitNumbers;
};

const User = mongoose.model('user', userSchema);
module.exports = { User };
