const express = require("express");

const router = express.Router();

const {
  newOrder,
  getAdminOrders,
  getSingleOrder,
  processPayment,
  proccessOrder,
  getMyOrders,
} = require("../controller/order");
const { authenticateUser, authorizeRoles } = require("../middleware/auth");

router.post("/create", authenticateUser, newOrder);

router.put(
  "/admin/update/:_id",
  authenticateUser,
  authorizeRoles("admin"),
  proccessOrder
);

router.get("/getsinglerorder/:id", authenticateUser, getSingleOrder);

router.get("/loginUserorder", authenticateUser, getMyOrders);

router.post("/payment", authenticateUser, processPayment);

router.get(
  "/allorder",
  authenticateUser,
  authorizeRoles("admin"),
  getAdminOrders
);

module.exports = router;

// get order by employee
