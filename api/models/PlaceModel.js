const mongoose = require("mongoose");

const PlaceSchema = new mongoose.Schema({
  //mongoose.Types.ObjectId represents a unique identifier for a document in a MongoDB database.
  //We can add a ref to be the reference to the User model
  owner: { type: mongoose.Types.ObjectId, ref: "UserModel" },
  title: String,
  address: String,
  photos: [String],
  description: String,
  perks: [String],
  extraInfo: String,
  checkIn: Number,
  checkOut: Number,
  maxGuests: Number,
  price: Number,
});

const PlaceModel = mongoose.model("PlaceModel", PlaceSchema);

module.exports = PlaceModel;
