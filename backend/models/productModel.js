import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  desc: String,
  image: String,
});

export default mongoose.model("Product", ProductSchema);
