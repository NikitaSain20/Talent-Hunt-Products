import User from "../models/userModel.js"; // FIXED: added .js extension
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET = "supersecret123";
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "admin123";

export const userSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate
    if (!name || !email || !password) {
      return res.json({ success: false, error: "All fields are required" });
    }

    // Check if user already exists
    const alreadyUser = await User.findOne({ email });
    if (alreadyUser) {
      return res.json({ success: false, error: "Email already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    await User.create({
      name,
      email,
      password: hashedPass,
      role: "user",
    });

    res.json({ success: true, message: "User registered successfully" });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
};

// ---------------------- UNIFIED LOGIN (USER & ADMIN) ----------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, error: "Email and password required" });
    }

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = jwt.sign({ email, role: "admin" }, SECRET, {
        expiresIn: "1d",
      });
      return res.json({ success: true, token });
    }

    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, error: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.json({ success: false, error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, SECRET, {
      expiresIn: "1d",
    });

    res.json({ success: true, token });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
};
