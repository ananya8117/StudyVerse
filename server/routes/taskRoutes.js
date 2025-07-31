import express from "express";
import Task from "../models/Task.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all tasks for logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ dueDate: 1 });
    res.json(tasks);
  } catch (err) {
    console.error("Error getting tasks:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Create new task
router.post("/", protect, async (req, res) => {
  const { title, description, dueDate, priority = "Medium" } = req.body;
  try {
    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      dueDate,
      priority,
    });
    res.status(201).json(task);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update task (e.g. mark completed or edit)
router.put("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });

    Object.assign(task, req.body); // update any fields sent
    await task.save();

    res.json(task);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete task
router.delete("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
