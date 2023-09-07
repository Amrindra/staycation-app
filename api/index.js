const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const UserModel = require("./models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const imageDownloader = require("image-downloader");
const multer = require("multer");
const fs = require("fs");
const PlaceModel = require("./models/PlaceModel");
const BookingModel = require("./models/BookingModel");

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

// This function is used to get the token and to be reusable
function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(
      req.cookies.token,
      process.env.JWT_SECRET_KEY,
      {},
      async (err, userData) => {
        if (err) throw err;
        resolve(userData);
      }
    );
  });
}

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
    checkOut,
    maxGuests,
    price,
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
      checkOut,
      maxGuests,
      price,
    });
    res.json(placeDocument);
  });
});

// Get request for Places endpoint for a particular user
app.get("/user-places", (req, res) => {
  const { token } = req.cookies;

  jwt.verify(token, process.env.JWT_SECRET_KEY, {}, async (error, userData) => {
    const { id } = userData;

    res.json(await PlaceModel.find({ owner: id }));
  });
});

// Get request for all user
app.get("/places", async (req, res) => [res.json(await PlaceModel.find())]);

// Get places by ID
app.get("/places/:id", async (req, res) => {
  const { id } = req.params;

  res.json(await PlaceModel.findById(id));
});

// Update places
app.put("/places", async (req, res) => {
  const { token } = req.cookies;
  const {
    id,
    title,
    address,
    photos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;

  jwt.verify(token, process.env.JWT_SECRET_KEY, {}, async (error, userData) => {
    const placeDocument = await PlaceModel.findById(id);

    if (error) throw error;
    // Checking the current login user is the same as the owner user
    if (userData.id === placeDocument.owner.toString()) {
      placeDocument.set({
        title,
        address,
        photos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });
      await placeDocument.save();
      res.json("Ok");
    }
  });
});

app.post("/bookings", async (req, res) => {
  const userData = await getUserDataFromReq(req);
  const { placeId, checkIn, checkOut, numberOfGuests, name, email, phone } =
    req.body;

  BookingModel.create({
    user: userData.id,
    placeId,
    checkIn,
    checkOut,
    numberOfGuests,
    name,
    email,
    phone,
  })
    .then((doc) => {
      res.json(doc);
    })
    .catch((error) => {
      throw error;
    });
});

app.get("/bookings", async (req, res) => {
  const userData = await getUserDataFromReq(req);
  res.json(await BookingModel.find({ user: userData.id }).populate("placeId"));
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

app.listen(8000);
