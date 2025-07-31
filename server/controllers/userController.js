// controllers/userController.js
import User from "../models/User.js";

// Get current user info
export const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
};

// Update current user info
export const updateMe = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;

  await user.save();

  res.json({
    name: user.name,
    email: user.email,
    id: user._id,
  });
};
