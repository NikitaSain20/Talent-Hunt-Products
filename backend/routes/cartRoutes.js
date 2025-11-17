import express from "express";
import {
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  viewCart
} from "../controllers/cartController.js";

const router = express.Router();

router.post("/add", addToCart);
router.put("/update", updateCartItem);
router.delete("/remove", removeFromCart);
router.delete("/clear", clearCart);
router.get("/:userId", viewCart);

export default router;
