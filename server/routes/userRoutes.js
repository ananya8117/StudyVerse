import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/userModel.js";

const router = express.Router();

// GET user profile
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user info" });
  }
});

// PATCH user profile (update name or email)
router.patch("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile" });
  }
});

export default router;
