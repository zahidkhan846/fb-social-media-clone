const express = require("express");

const {
  markNotificationsAsRead,
  markNotificationAsRead,
} = require("../controllers/notification");
const { isAuth } = require("../middlewares/auth");

const router = express.Router();

router.get("/mark-as-read/all", isAuth, markNotificationsAsRead);
router.get("/mark-as-read/:notificationId", isAuth, markNotificationAsRead);

module.exports = router;
