const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    imageUrl: { type: String, required: false },
    username: { type: String, required: true },
    gender: { type: String, required: true },
    bio: { type: String, required: false },
    website: { type: String, required: false },
    location: { type: String, required: false },
    phone: { type: String, required: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
