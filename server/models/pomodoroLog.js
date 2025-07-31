// server/models/pomodoroLog.js
import mongoose from "mongoose";

const pomodoroLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mode: {
      type: String,
      enum: ["focus", "short", "long"],
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const PomodoroLog = mongoose.model("PomodoroLog", pomodoroLogSchema);

export default PomodoroLog;
