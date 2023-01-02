const express = require("express");
const database = require("./config/db");
const cors = require("cors");
const authRoutes = require("./routes/auth");

const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(cors());

app.use("/auth", authRoutes);

app.listen(8080, async () => {
  try {
    await database();
    console.log("Database connected!");
  } catch (error) {
    console.log("Something went wrong while connecting database.");
  }
  console.log("Server listning on http://localhost:8080");
});
