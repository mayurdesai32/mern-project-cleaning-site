const Employee = require("../models/employeeSchema");
const User = require("../models/userSchema");
const AppError = require("../error_handler/AppError");
const wrapAsync = require("../error_handler/AsyncError");

// to Create Employee

const createEmployee = wrapAsync(async (req, res, next) => {
  const { userId, allService = [] } = req.body;

  if (!userId) {
    return next(new AppError("some of the userId fields is missing", 404));
  }

  let employee = await User.findById(userId);

  if (!employee) {
    return next(new AppError("no user found using this id: " + userId, 404));
  }

  if (employee.role !== "employee") {
    return next(
      new AppError(` please first change role of ${userId} to employee `, 404)
    );
  }

  const exist = await Employee.findOne({ userId });
  if (exist) {
    return next(
      new AppError(`Employee already exist with this userId ${userId} `, 404)
    );
  }
  //  let allService=[];
  //  serviceId.map((ele,id)=>{});

  await Employee.create({
    userId,
    email: employee.email,
    allService,
  });

  res.status(200).json({
    success: true,
    message: "employee Created Successfully",
  });
});

// to read all the Service
const readallEmployee = wrapAsync(async (req, res) => {
  const employee = await Employee.find()
    .populate("userId")
    .populate("allService.service")
    .populate("reviews.user")
    .exec();

  res.status(200).json({
    success: true,
    employee,
  });
});

// get employee by service
const getEmployeebyService = wrapAsync(async (req, res) => {
  const { serviceId } = req.params;

  if (!serviceId) {
    return next(new AppError("Please provide a service ID.", 400));
  }

  // Find employees by service ID
  const employees = await Employee.find({
    allService: { $elemMatch: { service: serviceId } },
  })
    .populate("userId")
    .populate("allService.service")
    .populate("reviews.user");

  if (employees.length === 0) {
    return next(
      new AppError("No employees found with this service ID: " + serviceId, 404)
    );
  }

  res.status(200).json({
    success: true,
    employees,
  });
});

// to read  the Service
const readsingleEmployee = wrapAsync(async (req, res, next) => {
  const employee = await Employee.findById(req.params._id)
    .populate("userId")
    .populate("allService.service")
    .populate("reviews.user")
    .exec();
  if (!employee) {
    return next(new AppError("employee not found by this id: " + _id, 404));
  }
  res.status(200).json({ success: true, employee });
});

// to update the Service
const updateEmployee = wrapAsync(async (req, res, next) => {
  let employee = await Employee.findById(req.params._id);

  if (!employee) {
    return next(new AppError("employee not found by this id: " + _id, 404));
  }

  await employee.save();

  res.status(200).json({
    success: true,
    message: "employee Updated Successfully",
  });
});

// to delete product
const removeEmployee = wrapAsync(async (req, res, next) => {
  let employee = await Employee.findById(req.params._id);
  if (!employee) {
    return next(new AppError("employee not found by this id: " + _id, 404));
  }

  await employee.deleteOne();
  res.status(200).json({
    success: true,
    message: "Employee Deleted Successfully",
  });
});

const addServiceEmployee = wrapAsync(async (req, res, next) => {
  let employee = await Employee.findById(req.params._id);
  if (!employee) {
    return next(new AppError("employee not found by this id: " + _id, 404));
  }
  const { serviceId } = req.body;

  let existed = employee.allService.find((e) => e.service.equals(serviceId));

  if (existed) return next(new AppError("service already added: ", 404));

  employee.allService.push({ service: serviceId });

  await employee.save();

  res.status(200).json({
    success: true,
    message: "services add to Employee Successfully",
  });
});
const removeServiceEmployee = wrapAsync(async (req, res, next) => {
  let employee = await Employee.findById(req.params._id);
  if (!employee) {
    return next(new AppError("employee not found by this id: " + _id, 404));
  }
  const { serviceId } = req.body;

  if (!serviceId) {
    return next(new AppError("please enter serviceId: ", 404));
  }

  employee.allService = employee.allService.filter((e, i) => {
    !e.service.equals(serviceId);
  });

  await employee.save();

  res.status(200).json({
    success: true,
    message: "services removed from Employee Successfully",
  });
});

module.exports = {
  createEmployee,
  readsingleEmployee,
  readallEmployee,
  removeEmployee,
  updateEmployee,
  addServiceEmployee,
  removeServiceEmployee,
  getEmployeebyService,
};
