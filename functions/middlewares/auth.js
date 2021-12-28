const { db, admin } = require("../config/admin");

exports.isAuth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split("Bearer ")[1];
  } else {
    return res.status(403).json({ message: "Unauthorized!" });
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    if (decodedToken.uid) {
      const usersDocs = await db
        .collection("users")
        .where("userId", "==", decodedToken.uid)
        .limit(1)
        .get();
      req.user = usersDocs.docs[0].data();
      next();
    }
  } catch (error) {
    return res.status(403).json({ error, message: "Unauthorized" });
  }
};
