const express = require("express");
const singleUpload = require("../middleware/multer");
const {
  createuser,
  loginin,
  forgotPassword,
  logout,
  resetPassword,
  updatePassword,
  updateByUser,
  updatePicByUser,
  getUserProfile,
  changeRole,
  getAllList,
} = require("../controller/user");
const { authenticateUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();
router.post("/register", singleUpload, createuser);

router.post("/login", loginin);

router.post("/forgotpassword", forgotPassword);
router.get("/profile", authenticateUser, getUserProfile);
router.put("/resetpassword", resetPassword);
router.put("/updateprofile", authenticateUser, updateByUser);
router.put("/updatepic", authenticateUser, singleUpload, updatePicByUser);
router.put("/updatepassword", authenticateUser, updatePassword);
router.post("/logout", authenticateUser, logout);
// admin
router.get("/all", authenticateUser, authorizeRoles("admin"), getAllList);
router.post(
  "/changerole",
  authenticateUser,
  authorizeRoles("admin"),
  changeRole
);

// change role
// add service
// add time
// change status
//

module.exports = router;
