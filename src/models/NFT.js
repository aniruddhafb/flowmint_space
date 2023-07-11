import mongoose, { Schema } from "mongoose";

const NFTSchema = new mongoose.Schema({
  metadata: String,
});

module.exports = mongoose.models.NFT || mongoose.model("NFT", NFTSchema);
