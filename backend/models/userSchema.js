const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const crypto = require('crypto');

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please enter the name"],
    minLength: [3, "Your name should be more than 3 char"],
    maxlength: [30, "Your name should not be more than 30 char"],
  },
  email: {
    type: String,
    required: [true, "Please enter the name"],
    unique: true,
    validate: [validator.isEmail, "Not a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter the password"],
    minLength: [6, "Your password should not be less than 6 char"],
    select: false,
  },

  role: {
    type: String,
    default: "user",
    enum: {
      values: ["user", "admin", "employee"],
      message: "please select correct role",
    },
  },

  address: {
    type: String,
    required: [true, "please enter address"],
  },
  city: {
    type: String,
    required: [true, "please enter city"],
  },
  country: {
    type: String,
    required: [true, "please enter country"],
  },
  pinCode: {
    type: Number,
    required: [true, "please enter pinCode"],
    minLength: [6, "Enter pin code should me 6 digits"],
    maxlength: [6, "Enter pin code should me 6 digits"],
  },
  createdAt: { type: Date, default: Date.now },

  avatar: {
    public_id: String,
    url: String,
  },
  otp: Number,
  otp_expire: Date,
});

// hashing password before saving user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare user password and comfirmed-password
// userSchema.methods.comparePassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// for verify login and password
userSchema.methods.compareloginPasssword = async function (password) {
  const match = await bcrypt.compare(password, this.password);
  return match;
};

// Generating JWT token
userSchema.methods.generateAuthToken = async function () {
  let token = jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "10d" }
  );
  // this.tokens = this.tokens.concat({ token: token });
  // await this.save();
  return token;
};

const User = new mongoose.model("User", userSchema);
module.exports = User;
