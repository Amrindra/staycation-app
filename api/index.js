const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const UserModel = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const imageDownloader = require("image-downloader");
const multer = require("multer");
const fs = require("fs");
const PlaceModel = require("./models/Place");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

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

app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  await imageDownloader.image({
    url: link,
    dest: __dirname + "/uploads/" + newName,
  });

  res.json(newName);
});

// Using Multer library for uploading images from local computer
// This is where we will upload our file to
const photoMiddleWare = multer({ dest: "uploads/" });
app.post("/upload", photoMiddleWare.array("images", 50), (req, res) => {
  const uploadFiles = [];

  for (let i in req.files) {
    const { path, originalname } = req.files[i];
    const splitOrginalname = originalname.split(".");
    const onlyOriginalnameExtension =
      splitOrginalname[splitOrginalname.length - 1];

    // Combinning the old path with originalname extension
    const newPath = path + "." + onlyOriginalnameExtension;
    // Using fs to rename the path name. path is an old path and newPath is the new path name
    fs.renameSync(path, newPath);
    uploadFiles.push(newPath.replace("uploads/", ""));
  }
  res.json(uploadFiles);
  // THE SAMEPLE OF THE originalname.
  /*{
  fieldname: 'images',
  originalname: 'photo1693233892848.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  destination: 'uploads/',
  filename: 'aa51456b18b6b77db2432c3ad1528fc0',
  path: 'uploads/aa51456b18b6b77db2432c3ad1528fc0',
  size: 38401
}*/
});

// Post request for places
app.post("/places", (req, res) => {
  const { token } = req.cookies;
  const {
    title,
    address,
    photos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkout,
    maxGuests,
  } = req.body;

  jwt.verify(token, process.env.JWT_SECRET_KEY, {}, async (error, userData) => {
    if (error) throw error;
    const placeDocument = await PlaceModel.create({
      owner: userData.id,
      title,
      address,
      photos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkout,
      maxGuests,
    });
    res.json(placeDocument);
  });
});

// Get request for Places endpoint
app.get("/places", (req, res) => {
  const { token } = req.cookies;

  jwt.verify(token, process.env.JWT_SECRET_KEY, {}, async (error, userData) => {
    const { id } = userData;

    res.json(await PlaceModel.find({ owner: id }));
  });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

app.listen(4000);
