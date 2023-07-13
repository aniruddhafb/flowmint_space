import mongoose, { Schema } from "mongoose";

const CoordinatesSchema = new mongoose.Schema({
  coordinates: [String],
  title: String,
  link: String
});

module.exports =
  mongoose.models.Coordinates ||
  mongoose.model("Coordinates", CoordinatesSchema);
