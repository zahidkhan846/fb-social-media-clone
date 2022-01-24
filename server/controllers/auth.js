const User = require("../model/user");
const bcrypt = require("bcrypt");
const {
  registerUserErrors,
  isEmail,
  isMin,
  userFormValidator,
} = require("../utils/validators");
const jwt = require("jsonwebtoken");
const noUserIamge = require("../utils/no-user");

const registerUser = async (req, res) => {
  const userData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    username: req.body.username,
    gender: req.body.gender,
  };

  const errors = registerUserErrors(userData);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  }

  try {
    const newUser = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      username: userData.username,
      gender: userData.gender,
      imageUrl: noUserIamge,
    };
    const isUsername = await User.findOne({
      username: userData.username,
    }).exec();
    if (isUsername) {
      return res.status(400).json({ username: "Username is already in use!" });
    }
    const isEmail = await User.findOne({ email: userData.email }).exec();
    if (isEmail) {
      return res.status(400).json({ username: "Email is already in use!" });
    }
    const user = new User(newUser);

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(newUser.password, salt);
    user.password = hashedPassword;

    const regUser = await user.save();
    if (regUser) {
      const token = jwt.sign(regUser, process.env.JWT_SECRET, {
        expiresIn: "3600s",
      });
      return res.status(201).json({ message: "Successfully Created!", token });
    } else {
      throw new Error("Something went wrong");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong!" });
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
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(400).json({ email: "Email dosnt't exists!" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (isPasswordCorrect) {
      const loggeInUser = {
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        imageUrl: user.imageUrl,
        username: user.username,
        gender: user.gender,
        createdAt: new Date(user.createdAt).toISOString(),
      };

      const token = jwt.sign(loggeInUser, process.env.JWT_SECRET, {
        expiresIn: "3600s",
      });
      return res.status(200).json({
        message: "Successfully logged in.",
        token: token,
      });
    }
    return res.status(400).json({ password: "Password incorrect!" });
  } catch (error) {
    return res
      .status(statusCode)
      .json({ ...errors, message: "Something went wrong!" });
  }
};

const imageUpload = (req, res) => {};

const addUserDetails = async (req, res) => {
  const { bio, website, location, phone } = req.body;

  const errors = userFormValidator(bio, website, location, phone);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  }

  try {
    await User.findOneAndUpdate(
      { username: req.user.username },
      { bio, website, location, phone }
    );

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
