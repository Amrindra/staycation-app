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
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const mime = require("mime-types");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

const bcryptSalt = bcrypt.genSaltSync(10);

// const bucket = "staycation-booking-app";

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

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

// For uploading images to the S3 AWS cloud platform
async function uploadImagesToS3(path, originalFilename, mimetype) {
  const client = new S3Client({
    region: "us-east-2",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });

  const splitOrginalname = originalFilename.split(".");
  const onlyExtension = splitOrginalname[splitOrginalname.length - 1];
  const newFilename = Date.now() + "." + onlyExtension;

  await client.send(
    new PutObjectCommand({
      Bucket: "staycation-booking-app",
      Body: fs.readFileSync(path),
      Key: newFilename,
      ContentType: mimetype,
      ACL: "public-read",
    })
  );
  return `https://staycation-booking-app.s3.amazonaws.com/${newFilename}`;
}

// app.get("/test", (req, res) => {
//   res.json("Testing ok");
// });

app.post("/register", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);

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
  mongoose.connect(process.env.MONGO_URL);

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
  mongoose.connect(process.env.MONGO_URL);
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
  mongoose.connect(process.env.MONGO_URL);

  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  await imageDownloader.image({
    url: link,
    dest: "/tmp/" + newName,
  });
  const url = await uploadImagesToS3(
    "/tmp/" + newName,
    newName,
    mime.lookup("/tmp/" + newName)
  );
  res.json(url);
});

// Using Multer library for uploading images from local computer
// This is where we will upload our file to
const photoMiddleWare = multer({ dest: "/tmp" });
app.post("/upload", photoMiddleWare.array("images", 50), async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);

  const uploadFiles = [];

  for (let i in req.files) {
    const { path, originalname, mimetype } = req.files[i];
    const url = await uploadImagesToS3(path, originalname, mimetype);
    uploadFiles.push(url);
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
  mongoose.connect(process.env.MONGO_URL);

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
  mongoose.connect(process.env.MONGO_URL);

  const { token } = req.cookies;

  jwt.verify(token, process.env.JWT_SECRET_KEY, {}, async (error, userData) => {
    const { id } = userData;

    res.json(await PlaceModel.find({ owner: id }));
  });
});

// Get request for all user
app.get("/places", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  [res.json(await PlaceModel.find())];
});

// Get places by ID
app.get("/places/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);

  const { id } = req.params;

  res.json(await PlaceModel.findById(id));
});

// Update places
app.put("/places", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);

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
  mongoose.connect(process.env.MONGO_URL);

  const userData = await getUserDataFromReq(req);
  const {
    place,
    checkIn,
    checkOut,
    numberOfGuests,
    name,
    email,
    phone,
    price,
  } = req.body;

  // id is from the login Token that is assigned by the jwt
  BookingModel.create({
    user: userData.id,
    place,
    checkIn,
    checkOut,
    numberOfGuests,
    name,
    email,
    phone,
    price,
  })
    .then((doc) => {
      res.json(doc);
    })
    .catch((error) => {
      throw error;
    });
});

app.get("/bookings", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);

  const userData = await getUserDataFromReq(req);
  res.json(await BookingModel.find({ user: userData.id }).populate("place"));
  // "populate" is a method and a concept used to retrieve referenced documents from other collections in MongoDB when you query a document. It's particularly useful when you have relationships between different types of data stored in separate collections and you want to fetch related data in a single query.
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

app.listen(8000);
