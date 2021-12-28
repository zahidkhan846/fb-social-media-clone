const express = require("express");
const {
  getLoggedInUser,
  getOtherUser,
  followUser,
} = require("../controllers/user");

const { isAuth } = require("../middlewares/auth");

const router = express.Router();

router.get("/current-user", isAuth, getLoggedInUser);
router.get("/other-user/:username", getOtherUser);
router.post("/follow/:username", isAuth, followUser);

module.exports = router;
