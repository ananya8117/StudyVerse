import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true },
  description: String,
  dueDate: Date,
  priority: {
    type: String,
    enum: ["High", "Medium", "Low"],
    default: "Medium",
  },
  completed: { type: Boolean, default: false },
});

// ✅ Avoid OverwriteModelError
export default mongoose.models.Task || mongoose.model("Task", taskSchema);
