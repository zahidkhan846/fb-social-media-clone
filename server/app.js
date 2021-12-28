const express = require("express");
const database = require("./config/db");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(express.static("public"))

app.use(cors());

app.get("/api", (req, res) => {
  res.send("<p>Hello from fb server.</p>");
});

app.listen(8080, async () => {
  try {
    await database();
    console.log("Database connected!");
  } catch (error) {
    console.log("Something went wrong while connecting database.");
  }
  console.log("Server listning on http://localhost:8080");
});
