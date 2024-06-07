const express = require("express");

const {
  createService,
  readallService,
  readsingleService,
  removeService,
  updateService,
  addServiceImage,
  deleteServiceImage,
} = require("../controller/service");
const singleUpload = require("../middleware/multer");
const { authenticateUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.get("/all", readallService);

router.post(
  "/create",
  authenticateUser,
  authorizeRoles("admin"),
  singleUpload,
  createService
);
// by Id
router.get("/servicebyid/:_id", readsingleService);
router.put(
  "/updateservicebyid/:_id",
  authenticateUser,
  authorizeRoles("admin"),
  updateService
);
router.delete(
  "/admin/:_id",
  authenticateUser,
  authorizeRoles("admin"),
  removeService
);

router
  .route("/serviceimage/:id")
  .post(
    authenticateUser,
    authorizeRoles("admin"),
    singleUpload,
    addServiceImage
  )
  .delete(authenticateUser, authorizeRoles("admin"), deleteServiceImage);

module.exports = router;
