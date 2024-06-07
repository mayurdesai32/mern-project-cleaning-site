const Service = require("../models/serviceSchema");

const AppError = require("../error_handler/AppError");
const wrapAsync = require("../error_handler/AsyncError");
const getDataUri = require("../utils/dataUri");
const { ObjectId } = require("mongoose");
const cloudinary = require("cloudinary");
// to Create Service

const createService = wrapAsync(async (req, res, next) => {
  const { name, description, price } = req.body;

  if (!name || !description || !price) {
    return next(new AppError("some of the input fields is missing", 404));
  }
  let image;
  if (!req.file) {
    return next(new AppError("Service image not found", 404));
  }
  const file = getDataUri(req.file);
  const myCloud = await cloudinary.v2.uploader.upload(file.content);
  image = {
    public_id: myCloud.public_id,
    url: myCloud.secure_url,
  };

  await Service.create({
    name,
    description,

    price,

    images: [image],
  });

  res.status(200).json({
    success: true,
    message: "Service Created Successfully",
  });
});

// to read all the Service
const readallService = wrapAsync(async (req, res) => {
  const services = await Service.find();

  res.status(200).json({
    success: true,
    services,
  });
});

// to read  the Service
const readsingleService = wrapAsync(async (req, res, next) => {
  const service = await Service.findById(req.params._id);
  if (!service) {
    return next(new AppError("Service not found", 404));
  }
  res.status(200).json({ success: true, service });
});

// to update the Service
const updateService = wrapAsync(async (req, res, next) => {
  let service = await Service.findById(req.params._id);

  if (!service) {
    return next(new AppError("Service not found", 404));
  }

  const { name, description, price } = req.body;

  if (name) service.name = name;
  if (description) service.description = description;
  // if (category) product.category = category;
  if (price) service.price = price;
  // if (stock) product.stock = stock;

  await service.save();

  res.status(200).json({
    success: true,
    message: "service Updated Successfully",
  });
});

// add Service Image
const addServiceImage = wrapAsync(async (req, res, next) => {
  const service = await Service.findById(req.params.id);
  if (!service) return next(new AppError("service not found", 404));

  if (!req.file) return next(new AppError("service add image", 400));

  const file = getDataUri(req.file);
  const myCloud = await cloudinary.v2.uploader.upload(file.content);
  const image = {
    public_id: myCloud.public_id,
    url: myCloud.secure_url,
  };

  service.images.push(image);
  await service.save();

  res.status(200).json({
    success: true,
    message: "Image Added Successfully",
  });
});

const deleteServiceImage = wrapAsync(async (req, res, next) => {
  const id = req.query.imageId;

  if (!id) return next(new AppError("Please Image Id", 400));
  const service = await Service.findById(req.params.id);

  if (!service) return next(new AppError("service not found", 404));

  let isExist = -1;

  service.images.forEach((item, index) => {
    if (item._id.toString() === id.toString()) isExist = index;
  });

  if (isExist < 0) return next(new AppError("Image doesn't exist", 400));

  await cloudinary.v2.uploader.destroy(service.images[isExist].public_id);

  service.images.splice(isExist, 1);

  await service.save();

  res.status(200).json({
    success: true,
    message: "Image Deleted Successfully",
  });
});

// to delete product
const removeService = wrapAsync(async (req, res, next) => {
  let service = await Service.findById(req.params._id);
  if (!service) {
    return next(new AppError("product not found", 404));
  }

  for (let index = 0; index < service.images.length; index++) {
    await cloudinary.v2.uploader.destroy(service.images[index].public_id);
  }

  await service.deleteOne();
  res.status(200).json({
    success: true,
    message: "service Deleted Successfully",
  });
});

// // to Admin Products
// const getAdminServices = wrapAsync(async (req, res, next) => {
//   const service = await Service.find({});

//   // const outOfStock = Service.filter((i) => i.stock === 0);

//   res.status(200).json({
//     success: true,
//     service,
//     // outOfStock: outOfStock.length,
//     // inStock: products.length - outOfStock.length,
//   });
// });

module.exports = {
  createService,
  readallService,
  readsingleService,
  removeService,
  updateService,
  // getAdminServices,
  addServiceImage,
  deleteServiceImage,
};
