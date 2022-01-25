const jwt = require("jsonwebtoken");

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
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("DECODED TOKEN", decodedToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(403).json({ error, message: "Unauthorized" });
  }
};
