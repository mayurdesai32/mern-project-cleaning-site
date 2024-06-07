const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  clientInfo: {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    pinCode: {
      type: Number,
      required: true,
    },
  },

  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  serviceName: {
    type: String,

    required: true,
  },

  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },

  employeeName: {
    type: String,
    required: true,
  },
  bookingDay: {
    type: Number,
    required: true,
  },
  bookingMonth: {
    type: Number,
    required: true,
  },
  bookingYear: {
    type: Number,
    required: true,
  },
  bookingTimeSlot: {
    type: String,
    enum: ["timeSlot1", "timeSlot2", "timeSlot3", "timeSlot4"],
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["COD", "Online"],
    default: "COD",
  },

  paidAt: Date,
  paymentInfo: {
    id: String,
    status: String,
  },

  servicePrice: {
    type: Number,
    required: true,
  },
  taxPrice: {
    type: Number,
    required: true,
  },

  totalAmount: {
    type: Number,
    required: true,
  },

  orderStatus: {
    type: String,
    enum: ["Preparing", "Completed", "Accepted", "Rejected"],
    default: "Preparing",
  },
  completedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  remark: {
    type: String,
  },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
