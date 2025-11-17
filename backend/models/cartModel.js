import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  userId: String,
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      image: String,
      qty: { type: Number, default: 1 },
    },
  ],
  totalAmount: Number,
});

export default mongoose.model("cart", CartSchema);
