const {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} = require("@firebase/auth");

const { db, admin } = require("../config/admin");
const { auth, firebaseConfig } = require("../config/firebase");
const {
  isEmail,
  isMin,
  userFormValidator,
  registerUserErrors,
} = require("../utils/validators");

// image uplad imports
const BusBoy = require("busboy");
const path = require("path");
const os = require("os");
const fs = require("fs");

const registerUser = async (req, res) => {
  const newUser = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    username: req.body.username,
    gender: req.body.gender,
  };

  const errors = registerUserErrors(newUser);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  }

  try {
    const user = await db.doc(`/users/${newUser.username}`).get();
    if (user.exists) {
      return res.status(400).json({ username: "Username is already in use!" });
    } else {
      try {
        const userDoc = await createUserWithEmailAndPassword(
          auth,
          newUser.email,
          newUser.password
        );

        if (userDoc.user.uid) {
          const token = await userDoc.user.getIdToken();
          const user = {
            userId: userDoc.user.uid,
            username: newUser.username,
            email: newUser.email,
            imageUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/no-image.png?alt=media`,
            createdAt: new Date().toISOString(),
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            gender: newUser.gender,
          };

          await db.doc(`/users/${newUser.username}`).set(user);
          return res
            .status(201)
            .json({ message: "Successfully created/logged in.", token: token });
        }
      } catch (error) {
        res.status(400).json({ email: "Email already in use!" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  let statusCode = 500;
  let errors = {};

  if (isEmail(email)) errors.email = "Email must a valid email!";
  if (isMin(password, 6))
    errors.password = "Password must have minimum 6 character in it!";

  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  }
  try {
    const response = await signInWithEmailAndPassword(auth, email, password);
    if (!response.user.uid) {
      throw new Error("Invalid credentials!");
    }
    const token = await response.user.getIdToken();
    return res.status(200).json({
      message: "Successfully logged in.",
      token: token,
    });
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      statusCode = 404;
      errors.email = "User not found!";
    }
    if (error.code === "auth/wrong-password") {
      statusCode = 403;
      errors.password = "Wrong password provided!";
    }
    return res
      .status(statusCode)
      .json({ ...errors, message: "Something went wrong!" });
  }
};

const imageUpload = (req, res) => {
  let imageName;
  let imageUrl;
  let image = { filePath: null, mimetype: null };

  const busboy = new BusBoy({ headers: req.headers });
  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (
      mimetype !== "image/jpg" &&
      mimetype !== "image/jpeg" &&
      mimetype !== "image/png"
    ) {
      return res.status(400).json({
        message: "Invalid image file type, (.jpg , .jpeg, .png images only!)",
      });
    }
    const extension = filename.split(".")[filename.split(".").length - 1];
    imageName = `${Math.round(Math.random() * 1000000000000)}.${extension}`;
    const filePath = path.join(os.tmpdir(), imageName);
    image = { filePath, mimetype };
    file.pipe(fs.createWriteStream(filePath));
  });

  busboy.on("finish", async () => {
    admin
      .storage()
      .bucket()
      .upload(image.filePath, {
        resumable: false,
        metadata: { metadata: { contentType: image.mimetype } },
      })
      .then(() => {
        imageUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageName}?alt=media`;
        db.doc(`/users/${req.user.username}`).update({ imageUrl: imageUrl });
        return db
          .collection("posts")
          .where("createdBy", "==", req.user.username)
          .get()
          .then((snapshot) => {
            if (!snapshot.empty) {
              snapshot.forEach((doc) => {
                doc.ref.update({ creatorImageUrl: imageUrl });
              });
            }
          })
          .catch((err) => {
            throw new Error(
              "Something went wrong! [Image Upload/Update Posts User Image]"
            );
          });
      })
      .then(() => {
        return res.json({ message: "Successfully uploaded!", imageUrl });
      })
      .catch((error) => {
        res.status(500).json({
          message: error.message,
        });
      });
  });
  busboy.end(req.rawBody);
};

const addUserDetails = async (req, res) => {
  const { bio, website, location, phone } = req.body;

  const errors = userFormValidator(bio, website, location, phone);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  }

  try {
    await db
      .doc(`/users/${req.user.username}`)
      .update({ bio, website, location, phone });

    return res.status(201).json({
      message: "Sucessfully updated!",
      details: { bio, website, location, phone },
    });
  } catch (error) {
    res.status(500).json({
      errors: { message: error.message },
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  imageUpload,
  addUserDetails,
};
