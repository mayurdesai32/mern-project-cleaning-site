const express = require("express");

const {
  createEmployee,
  readsingleEmployee,
  readallEmployee,
  removeEmployee,
  updateEmployee,
  addServiceEmployee,
  removeServiceEmployee,
  getEmployeebyService,
} = require("../controller/employee");
const singleUpload = require("../middleware/multer");
const { authenticateUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.get("/all", authenticateUser, authorizeRoles("admin"), readallEmployee);

router.post(
  "/create",
  authenticateUser,
  authorizeRoles("admin"),
  singleUpload,
  createEmployee
);
// by Id
router.get("/employeebyid/:_id", readsingleEmployee);
router.put(
  "/updateemployeebyid/:_id",
  authenticateUser,
  authorizeRoles("admin"),
  updateEmployee
);

router.put(
  "/updateserviceemployee/:_id",
  authenticateUser,
  authorizeRoles("admin"),
  updateEmployee
);

router.put(
  "/addserviceemployee/:_id",
  authenticateUser,
  authorizeRoles("admin"),
  addServiceEmployee
);

router.put(
  "/removeserviceemployee/:_id",
  authenticateUser,
  authorizeRoles("admin"),
  removeServiceEmployee
);

router.delete(
  "/updateemployeebyid/:_id",
  authenticateUser,
  authorizeRoles("admin"),
  removeEmployee
);

router.get("/getemployeebyservice/:serviceId", getEmployeebyService);

// review

module.exports = router;
