import express from "express";
import {
  userSignup,
  login,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", userSignup);
router.post("/login", login);

export default router;
