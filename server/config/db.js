const mongoose = require("mongoose");

async function database() {
  await mongoose.connect("mongodb://localhost:27017/fb-db");
}

module.exports = database;
