import dotenv from "dotenv";
dotenv.config();

import express from "express";
import IsDbConnected from "./dbConnection.js";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import productRouter from "./routes/productRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import orderRouter from "./routes/orderRoutes.js";

const app = express();
app.use(
  cors({
    origin: "process.env.VITE_FRONTEND_URL",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

IsDbConnected(process.env.MONGODB_URL);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

app.use("/auth", authRouter);
app.use("/products", productRouter);

app.use("/cart", cartRouter);
app.use("/order", orderRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("Server Started successfully on PORT", PORT);
});
