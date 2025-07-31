// server/routes/pomodoroRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { logPomodoro, getTodayLogs } from "../controllers/pomodoroController.js";

const router = express.Router();

router.post("/logs", protect, logPomodoro);
router.get("/logs", protect, getTodayLogs);

export default router;
