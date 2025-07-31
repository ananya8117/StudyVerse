// server/routes/dashboard.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Task from '../models/Task.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const tasks = await Task.find({ user: userId });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.completed).length;

    const upcomingTasks = tasks
      .filter((t) => !t.completed && t.dueDate)
      .map((t) => ({
        id: t._id,
        title: t.title,
        due: t.dueDate,
      }));

    const weeklyGoals = [
      { id: 1, goal: "Complete 5 Pomodoro sessions", done: completedTasks >= 5 },
      { id: 2, goal: "Finish 3 tasks", done: completedTasks >= 3 },
      { id: 3, goal: "Revise 2 chapters", done: false }
    ];

    res.json({
      totalTasks,
      completedTasks,
      upcomingTasks,
      weeklyGoals
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
