// const uuid = require('uuid');
const stripe = require("stripe")(process.env.STRIPE_API_SECRET);

const Order = require("../models/orderSchema");
const AppError = require("../error_handler/AppError");
const wrapAsync = require("../error_handler/AsyncError");
const Employee = require("../models/employeeSchema");
const sendEmail = require("../utils/sendEmail");
const Service = require("../models/serviceSchema");

// to place an order
const newOrder = wrapAsync(async (req, res, next) => {
  const {
    clientInfo,
    serviceId,
    employeeId,
    remark = "",
    bookingDay,
    bookingMonth,
    bookingYear,
    bookingTimeSlot,
  } = req.body;

  if (
    !clientInfo ||
    !serviceId ||
    !employeeId ||
    !bookingDay ||
    !bookingMonth ||
    !bookingYear ||
    !bookingTimeSlot
  ) {
    return next(new AppError("some of the input fields is missing", 401));
  }
  const service = await Service.findById(serviceId);

  if (!service) {
    return next(new AppError(" service Id is not valid", 401));
  }

  const employee = await Employee.findById(employeeId);
  let exist = false;
  employee.timeBookingPending.forEach((e, i) => {
    if (
      e.day === bookingDay &&
      e.month === bookingMonth &&
      e.year === bookingYear &&
      e.timeSlot === bookingTimeSlot
    ) {
      exist = true;
    }
  });

  if (exist) {
    return next(new AppError("employee is unavaiable at timeSlot: ", 401));
  }

  employee.timeBookingPending.push({
    day: bookingDay,
    month: bookingMonth,
    year: bookingYear,
    timeSlot: bookingTimeSlot,
  });

  await employee.save();

  await Order.create({
    clientInfo,
    clientId: req.rootUser._id,
    serviceId,
    serviceName: service.name,
    employeeId,
    employeeName: employee.name,
    servicePrice: service.price,
    taxPrice: service.price * 0.18,
    remark,
    totalAmount: service.price + service.price * 0.18,
    bookingDay,
    bookingMonth,
    bookingYear,
    bookingTimeSlot,
  });

  if (employee.email) {
    await sendEmail({
      email: employee.email,
      subject: "Cleaning services:- order has been booked please check",
      message: "Cleaning services:- order has been booked please check",
    });
  }

  res.status(201).json({
    success: true,
    message: "Order Placed Successfully",
  });
});

const getAdminOrders = wrapAsync(async (req, res, next) => {
  const orders = await Order.find({});

  res.status(200).json({
    success: true,
    orders,
  });
});

const getMyOrders = wrapAsync(async (req, res, next) => {
  const orders = await Order.find({ clientId: req.rootUser._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

const getSingleOrder = wrapAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) return next(new AppError("Order Not Found", 404));

  res.status(200).json({
    success: true,
    order,
  });
});

const proccessOrder = wrapAsync(async (req, res, next) => {
  const order = await Order.findById(req.params._id);
  if (!order) return next(new AppError("Order Not Found", 404));

  const { orderStatus = "" } = req.body;

  if (!["Accepted", "Completed", "Preparing", "Rejected"].includes(orderStatus))
    return next(new AppError("please enter proper Orderstatus ", 400));

  console.log(order.bookingDay);

  if (order.orderStatus === "Preparing" && orderStatus === "Accepted") {
    order.orderStatus = "Accepted";
  } else if (orderStatus === "Completed") {
    order.orderStatus = "Completed";
    order.completedAt = new Date(Date.now());

    const employee = await Employee.findById(order.employeeId);

    employee.timeBookingPending = employee.timeBookingPending.filter((e, i) => {
      return (
        e.day !== order.bookingDay ||
        e.month !== order.bookingMonth ||
        e.year !== order.bookingYear ||
        e.timeSlot !== order.bookingTimeSlot
      );
    });

    employee.timeBookingOver.push({
      day: order.bookingDay,
      month: order.bookingMonth,
      year: order.bookingYear,
      timeSlot: order.bookingTimeSlot,
      status: "Completed",
    });

    await employee.save();
  } else if (orderStatus === "Rejected") {
    order.orderStatus = "Rejected";
    order.completedAt = new Date(Date.now());

    const employee = await Employee.findById(order.employeeId);

    employee.timeBookingPending = employee.timeBookingPending.filter((e, i) => {
      return (
        e.day !== order.bookingDay ||
        e.month !== order.bookingMonth ||
        e.year !== order.bookingYear ||
        e.timeSlot !== order.bookingTimeSlot
      );
    });
    employee.timeBookingOver.push({
      day: order.bookingDay,
      month: order.bookingMonth,
      year: order.bookingYear,
      timeSlot: order.bookingTimeSlot,
      status: "Rejected",
    });

    await employee.save();
  } else {
    return next(new AppError("Order Already closed", 400));
  }

  await order.save();

  res.status(200).json({
    success: true,
    message: "Order Processed Successfully",
  });
});

const processPayment = wrapAsync(async (req, res, next) => {
  const { totalAmount } = req.body;
  const { client_secret } = await stripe.paymentIntents.create({
    amount: Number(totalAmount * 100),
    currency: "inr",
  });

  console.log(client_secret);
  res.status(200).json({
    success: true,
    client_secret,
  });
});

module.exports = {
  newOrder,
  getAdminOrders,
  getSingleOrder,
  processPayment,
  proccessOrder,
  getMyOrders,
};
