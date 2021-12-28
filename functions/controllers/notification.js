const { db } = require("../config/admin");

const markNotificationAsRead = async (req, res) => {
  const { notificationId } = req.params;
  let status = 500;
  try {
    const notificationsDocRef = await db
      .collection("notifications")
      .doc(notificationId);
    const notificationsSnap = await notificationsDocRef.get();
    const notificationData = notificationsSnap.data();
    if (notificationData.recipient !== req.user.username) {
      status = 403;
      throw new Error("Unauthorized!");
    }
    await notificationsDocRef.update({ read: true });
    return res.json({ message: "Marked as read!" });
  } catch (error) {
    res.status(status).json({
      errors: { message: error.message },
    });
  }
};

const markNotificationsAsRead = async (req, res) => {
  let status = 500;
  try {
    const notiSnap = await db
      .collection("notifications")
      .where("recipient", "==", req.user.username)
      .get();

    if (notiSnap.empty) {
      status = 404;
      throw new Error("Notifications does not exits!");
    }
    notiSnap.forEach((doc) => {
      doc.ref.update({ read: true });
    });
    return res.status(201).json({ message: "Successfully unmarked" });
  } catch (error) {
    return res
      .status(status)
      .json({ message: "Something went wrong!" || error.message });
  }
};

module.exports = {
  markNotificationAsRead,
  markNotificationsAsRead,
};
