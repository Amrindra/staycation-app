const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const UserModel = require("./models/User");
const bcrypt = require("bcryptjs");

require("dotenv").config();
const app = express();
app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5177",
  })
);

const bcryptSalt = bcrypt.genSaltSync(10);

mongoose.connect(process.env.MONGO_URL);

app.get("/test", (req, res) => {
  res.json("Testing ok");
});

app.post("/register", async (req, res) => {
  // This coming from the register form client side
  const { name, email, password } = req.body;

  try {
    const userDocument = await UserModel.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json(userDocument);
  } catch (error) {
    res.status(422).json(error);
  }
});

app.listen(4000);
