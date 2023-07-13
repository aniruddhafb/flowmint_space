import mongoose, { Schema } from "mongoose";

const UserSchema = new mongoose.Schema({
  wallet: String,
});

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
