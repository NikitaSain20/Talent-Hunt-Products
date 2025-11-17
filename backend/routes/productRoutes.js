import express from "express";
import upload from "../middlewares/upload.js";
import { addProduct, getProducts } from "../controllers/productController.js";

const router = express.Router();

router.post("/add", upload.single("image"), addProduct);
router.get("/", getProducts);

export default router;
