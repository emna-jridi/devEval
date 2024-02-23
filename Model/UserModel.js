const mongoose = require("mongoose");
const validator = require("validator");
const roles = require('../Config/constConfig')

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Please provide your full name"],
  }
  ,
  email: {
    type: String,
    required: [true, "Please provide an email"],
    validate: [validator.isEmail, "Please provide a valid email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  userType: {
    type: String,
    required: true,
    enum: {
      values: [roles.RA, roles.RPA, roles.RTA],
      message: `{value} does not have permission to connect`
    },

  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model("user", userSchema);
