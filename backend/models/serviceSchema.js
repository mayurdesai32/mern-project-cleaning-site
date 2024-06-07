const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Name"],
  },
  description: {
    type: String,
    required: [true, "Please Enter Description"],
  },
  price: {
    type: Number,
    required: [true, "Please Enter Price"],
  },

  images: [{ public_id: String, url: String }],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
