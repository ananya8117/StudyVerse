// server/server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboard.js"; // ✅ Use this only
import taskRoutes from "./routes/taskRoutes.js";
import statsRoutes from './routes/stats.js';
import pomodoroRoutes from "./routes/pomodoroRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes); // ✅ Correct route
app.use("/api/tasks", taskRoutes);
app.use('/api/stats', statsRoutes);
app.use("/api/pomodoro", pomodoroRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.send("🎉 Welcome to the StudyVerse API!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
