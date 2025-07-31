import PomodoroLog from "../models/pomodoroLog.js";
import dayjs from "dayjs";

export const logPomodoro = async (req, res) => {
  const { mode } = req.body;

  if (!["focus", "short", "long"].includes(mode)) {
    return res.status(400).json({ message: "Invalid mode" });
  }

  const log = new PomodoroLog({
    user: req.user._id,
    mode,
  });

  await log.save();
  res.status(201).json({ message: "Logged", log });
};

export const getTodayLogs = async (req, res) => {
  const start = dayjs().startOf("day").toDate();
  const end = dayjs().endOf("day").toDate();

  const logs = await PomodoroLog.find({
    user: req.user._id,
    timestamp: { $gte: start, $lte: end },
  }).sort({ timestamp: -1 });

  res.json(logs);
};
