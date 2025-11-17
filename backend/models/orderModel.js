import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: String,
  items: Array,
  totalAmount: Number,
  date: { type: Date, default: Date.now },
});

export default mongoose.model("order", OrderSchema);
