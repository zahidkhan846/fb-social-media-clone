const User = require("../model/user");
const bcrypt = require("bcrypt");
const { registerUserErrors } = require("../utils/validators");
const jwt = require("jsonwebtoken");

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
      imageUrl:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
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

module.exports = {
  registerUser,
};
