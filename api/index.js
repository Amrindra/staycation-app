const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const UserModel = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cookieParser());

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

  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    const decryptPassword = bcrypt.compareSync(password, existingUser.password);

    if (decryptPassword) {
      jwt.sign(
        {
          id: existingUser._id,
          email: existingUser.email,
        },
        process.env.JWT_SECRET_KEY,
        {},
        // Generating cookie for the user when they login
        (error, token) => {
          if (error) throw error;
          // The res.cookie() method is used for setting the cookie name to value. The value parameter can be a string or an object converted to JSON.
          // Syntax
          // res.cookie( name, value, [options] )
          res.cookie("token", token).json(existingUser);
        }
      );
    } else {
      res.status(422).json("Wrong credential!");
    }
  } else {
    res.status(404).json("not found");
  }
});

app.get("/profile", (req, res) => {
  // Grab cookie token from a user when login by using req.cookies
  const { token } = req.cookies;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, {}, async (error, user) => {
      if (error) throw error;
      // Grab only name, email, and _id
      const { name, email, _id } = await UserModel.findById(user.id);
      // Send the request only name, email, and _id to avoid sending password to the client side
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

app.listen(4000);
