const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');
const crypto = require('crypto');

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

// userSchema.methods.generateToken = function () {
//     const token1 = Math.floor(Math.random() );
//     const token = crypto.createHash('sha256').update()
// };

const User = mongoose.model('user', userSchema);
module.exports = { User };
