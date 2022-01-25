const express = require("express");

const {
  registerUser,
  loginUser,
  imageUpload,
  addUserDetails,
} = require("../controllers/auth");
const { isAuth } = require("../middlewares/auth");

const router = express.Router();

router.post("/register-user", registerUser);
router.post("/login", loginUser);
router.post("/image-upload", isAuth, imageUpload);
router.post("/add-details", isAuth, addUserDetails);

module.exports = router;
