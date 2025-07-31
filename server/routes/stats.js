import express from "express";
import Task from "../models/task.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc    Get study stats for logged-in user
// @route   GET /api/stats
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const allTasks = await Task.find({ user: userId });

    const now = new Date();
    const today = now.getDay(); // Sunday = 0
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - today);
    weekStart.setHours(0, 0, 0, 0);

    const weeklyTasks = allTasks.filter(task => {
      const due = new Date(task.dueDate);
      return due >= weekStart && due <= now;
    });

    // Weekly Study Hours Estimate (1.5 hrs per task as default)
    const weeklyHours = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => {
      const count = weeklyTasks.filter(task => new Date(task.dueDate).getDay() === i).length;
      return { day, hours: count * 1.5 };
    });

    // Task Breakdown
    const taskBreakdown = [
      { name: "Completed", value: allTasks.filter(t => t.completed).length },
      { name: "Pending", value: allTasks.filter(t => !t.completed && new Date(t.dueDate) >= now).length },
      { name: "Overdue", value: allTasks.filter(t => !t.completed && new Date(t.dueDate) < now).length },
    ];

    // Daily Task Completion vs Pending
    const dailyTaskStats = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => {
      const completed = allTasks.filter(t => t.completed && new Date(t.dueDate).getDay() === i).length;
      const pending = allTasks.filter(t => !t.completed && new Date(t.dueDate).getDay() === i).length;
      return { day, completed, pending };
    });

    // Overall Completion %
    const total = allTasks.length || 1;
    const completedCount = allTasks.filter(t => t.completed).length;
    const overallCompletionRate = Math.round((completedCount / total) * 100);

    res.json({
      weeklyHours,
      taskBreakdown,
      dailyTaskStats,
      overallCompletionRate,
    });

  } catch (error) {
    res.status(500).json({ message: "Error generating stats", error: error.message });
  }
});

export default router;
