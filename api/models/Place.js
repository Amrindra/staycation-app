const mongoose = require("mongoose");

const PlaceSchema = new mongoose.Schema({
  //mongoose.Types.ObjectId represents a unique identifier for a document in a MongoDB database.
  //   We can add a ref to the User model
  owner: { type: mongoose.Types.ObjectId, ref: "User" },
  title: String,
  address: String,
  photos: [String],
  description: String,
  perks: [String],
  extraInfo: String,
  checkIn: Number,
  checkOut: Number,
  maxGuests: Number,
});

const PlaceModel = mongoose.model("Place", PlaceSchema);

module.exports = PlaceModel;
