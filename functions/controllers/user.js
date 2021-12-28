const { db } = require("../config/admin");

const getLoggedInUser = async (req, res) => {
  try {
    const user = await db.doc(`users/${req.user.username}`).get();

    if (user.exists) {
      let loggedInUser = {};
      const likeDocs = await db
        .collection("likes")
        .where("likedBy", "==", req.user.username)
        .get();
      loggedInUser = user.data();
      loggedInUser.likes = [];
      likeDocs.forEach((doc) => {
        loggedInUser.likes.push(doc.data());
      });
      const notificationsSnap = await db
        .collection("notifications")
        .where("recipient", "==", req.user.username)
        .orderBy("createdAt", "desc")
        .limit(10)
        .get();
      loggedInUser.notifications = [];
      if (!notificationsSnap.empty) {
        notificationsSnap.forEach((doc) => {
          loggedInUser.notifications.push({ nId: doc.id, ...doc.data() });
        });
      }
      const postsSnap = await db
        .collection("posts")
        .where("createdBy", "==", req.user.username)
        .orderBy("createdAt", "desc")
        .get();
      loggedInUser.posts = [];
      if (!postsSnap.empty) {
        postsSnap.forEach((doc) => {
          loggedInUser.posts.push({ postId: doc.id, ...doc.data() });
        });
      }
      const connectionsSnap = await db
        .collection("connections")
        .where("follower", "==", req.user.username)
        .get();
      loggedInUser.connections = {};
      loggedInUser.connections.following = [];
      if (!connectionsSnap.empty) {
        connectionsSnap.forEach((doc) => {
          loggedInUser.connections.following.push({
            cId: doc.id,
            ...doc.data(),
          });
        });
      }
      return res.status(200).json({ user: loggedInUser });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOtherUser = async (req, res) => {
  const { username } = req.params;
  let status = 500;
  let user = {};
  try {
    const anotherUserSnap = await db.collection("users").doc(username).get();
    if (!anotherUserSnap.exists) {
      status = 404;
      throw new Error("Invalid username provided (user does not exists)!");
    }
    user = anotherUserSnap.data();
    user.posts = [];
    const anotherUserPostsSnap = await db
      .collection("posts")
      .where("createdBy", "==", username)
      .limit(10)
      .orderBy("createdAt", "desc")
      .get();

    if (!anotherUserPostsSnap.empty) {
      anotherUserPostsSnap.forEach((doc) => {
        const singlePost = doc.data();
        user.posts.push({ postId: doc.id, ...singlePost });
      });
    }
    return res.json(user);
  } catch (error) {
    res.status(status).json({
      errors: { message: error.message },
    });
  }
};

const followUser = async (req, res) => {
  let status = 500;
  const otherUsername = req.params.username;
  let otherUser;
  try {
    if (req.user.username === otherUsername) {
      status = 403;
      throw new Error("You shouldn't follow you virtually!");
    }
    const otherUserSnap = await db.doc(`/users/${otherUsername}`).get();
    if (!otherUserSnap.exists) {
      status = 403;
      throw new Error("User doesn't exists!");
    }
    otherUser = otherUserSnap.data();
    let otherUserFullName = `${otherUser.firstName} ${otherUser.lastName}`;
    const snapshot = await db
      .collection("connections")
      .where("followingUsername", "==", otherUsername)
      .get();
    if (!snapshot.empty) {
      status = 403;
      throw new Error(`${otherUserFullName} already followed by you!`);
    }
    const connectionDetail = {
      username: req.user.username,
      followingUsername: otherUsername,
      followingUserFullName: otherUserFullName,
    };
    await db.collection("connections").add(connectionDetail);
    return res
      .status(201)
      .json({ message: "Successfully followed!", data: connectionDetail });
  } catch (error) {
    res.status(status).json({
      errors: { message: error.message },
    });
  }
};

module.exports = {
  getLoggedInUser,
  getOtherUser,
  followUser,
};
