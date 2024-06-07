const mongoose = require("mongoose");
const validator = require("validator");

const employeeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  email: {
    type: String,
    required: [true, "Please enter the email"],
    unique: true,
    validate: [validator.isEmail, "Not a valid email"],
  },
  allService: [
    {
      service: {
        type: mongoose.Schema.ObjectId,
        ref: "Service",
        required: true,
      },
    },
  ],
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  timeBookingPending: [
    {
      day: {
        type: Number,
        required: true,
      },
      month: {
        type: Number,
        required: true,
      },
      year: {
        type: Number,
        required: true,
      },
      timeSlot: {
        type: String,
        required: true,
        enum: {
          values: ["timeSlot1", "timeSlot2", "timeSlot3", "timeSlot4"],
          message: "Please select the correct slot properly",
        },
      },
    },
  ],
  timeBookingOver: [
    {
      day: {
        type: Number,
        required: true,
      },
      month: {
        type: Number,
        required: true,
      },
      year: {
        type: Number,
        required: true,
      },
      timeSlot: {
        type: String,
        enum: {
          values: ["timeSlot1", "timeSlot2", "timeSlot3", "timeSlot4"],
          message: "Please select the correct slot properly",
        },
      },
      status: {
        type: String,
        required: true,
        enum: {
          values: ["Preparing", "Completed", "Accepted", "Rejected"],
          message: "Please select the correct status properly",
        },
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
