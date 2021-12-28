const functions = require("firebase-functions");
const express = require("express");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const notificationRoutes = require("./routes/notification");

const cors = require("cors");

const { db } = require("./config/admin");

const app = express();

// MIDLEWARES
app.use(cors());

// AUTHENTICATION
app.use("/auth", authRoutes);
// USER
app.use("/user", userRoutes);
// POST
app.use("/post", postRoutes);
// NOTIFICATIONS
app.use("/notification", notificationRoutes);

exports.api = functions.https.onRequest(app);

// EVENT HANDLERS
exports.createLikeNotification = functions.firestore
  .document("likes/{id}")
  .onCreate((snapshot) => {
    const like = snapshot.data();
    return db
      .doc(`/posts/${like.postId}`)
      .get()
      .then((postSnap) => {
        const post = postSnap.data();
        const newNotification = {
          createdAt: new Date().toISOString(),
          recipient: post.createdBy,
          sender: like.likedBy,
          type: "like",
          read: false,
          postId: postSnap.id,
        };
        if (postSnap.exists && post.createdBy !== snapshot.data().likedBy) {
          return db.doc(`/notifications/${snapshot.id}`).set(newNotification);
        }
      })
      .catch((error) => console.log(error));
  });

exports.deleteNotificationOnUnlike = functions.firestore
  .document("likes/{id}")
  .onDelete((snapshot) => {
    return db
      .doc(`notifications/${snapshot.id}`)
      .delete()
      .catch((err) => console.log(err));
  });

exports.createCommentNotification = functions.firestore
  .document("comments/{id}")
  .onCreate((snapshot) => {
    const comment = snapshot.data();
    return db
      .doc(`/posts/${comment.postId}`)
      .get()
      .then((postSnap) => {
        const post = postSnap.data();
        const newNotification = {
          createdAt: new Date().toISOString(),
          recipient: post.createdBy,
          sender: comment.createdBy,
          type: "comment",
          read: false,
          postId: postSnap.id,
        };
        if (postSnap.exists && post.createdBy !== snapshot.data().likedBy) {
          return db.doc(`/notifications/${snapshot.id}`).set(newNotification);
        }
      })
      .catch((error) => console.log(error));
  });

exports.deleteNotificationOnUnComment = functions.firestore
  .document("comments/{id}")
  .onDelete((snapshot) => {
    return db
      .doc(`notifications/${snapshot.id}`)
      .delete()
      .catch((err) => console.log(err));
  });
