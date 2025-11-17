import express from "express";
import { placeOrder, allOrders, getUserOrders } from "../controllers/orderController.js";

const router = express.Router();

router.post("/place", placeOrder);
router.get("/admin/all", allOrders);
router.get("/:userId", getUserOrders);

export default router;
