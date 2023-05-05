const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const UserModel = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const app = express();
app.use(express.json());

const bcryptSalt = bcrypt.genSaltSync(10);

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

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

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const userDocument = await UserModel.findOne({ email });
  if (userDocument) {
    const decryptPassword = bcrypt.compareSync(password, userDocument.password);

    if (decryptPassword) {
      jwt.sign(
        { id: userDocument._id, email: userDocument.email },
        process.env.JWT_SECRET_KEY,
        {},
        (error, token) => {
          if (error) throw error;

          res.cookie("token", token).json("Found");
        }
      );
    } else {
      res.status(422).json("Wrong credential!");
    }
  } else {
    res.status(404).json("not found");
  }
});

app.listen(4000);
