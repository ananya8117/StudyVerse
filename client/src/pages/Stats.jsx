import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from "recharts";
import axios from "axios";

const COLORS = ["#4ade80", "#facc15", "#ef4444"];
const API_URL = "http://localhost:5000/api/stats";

export default function Stats() {
  const [lineData, setLineData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [completionRate, setCompletionRate] = useState(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { weeklyHours, taskBreakdown, dailyTaskStats, overallCompletionRate } = res.data;
        setLineData(weeklyHours);
        setPieData(taskBreakdown);
        setBarData(dailyTaskStats);
        setCompletionRate(overallCompletionRate);
      } catch (err) {
        console.error("Error fetching stats", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6 space-y-8 text-gray-800 dark:text-white">
      <h2 className="text-3xl font-bold">📊 Stats Dashboard</h2>
      <p className="text-gray-500 dark:text-gray-300 text-lg">
        Analytics but make it aesthetic.
      </p>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-100 dark:bg-green-900 p-5 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-green-700 dark:text-green-300">Total Hours This Week</h3>
          <p className="text-3xl font-bold mt-2">
            {lineData.reduce((sum, d) => sum + d.hours, 0)} hrs
          </p>
        </div>
        <div className="bg-yellow-100 dark:bg-yellow-900 p-5 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-yellow-700 dark:text-yellow-300">Tasks Completed</h3>
          <p className="text-3xl font-bold mt-2">
            {pieData.find(p => p.name === "Completed")?.value || 0}
          </p>
        </div>
        <div className="bg-red-100 dark:bg-red-900 p-5 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-red-700 dark:text-red-300">Tasks Overdue</h3>
          <p className="text-3xl font-bold mt-2">
            {pieData.find(p => p.name === "Overdue")?.value || 0}
          </p>
        </div>
      </div>

      {/* Line and Pie Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
          <h3 className="text-xl font-semibold mb-4">🗓️ Weekly Study Hours</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", color: "#fff" }} />
              <Line type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
          <h3 className="text-xl font-semibold mb-4">🧠 Task Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", color: "#fff" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart and Completion Ring */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
          <h3 className="text-xl font-semibold mb-4">📌 Completed vs Pending (Daily)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", color: "#fff" }} />
              <Legend />
              <Bar dataKey="completed" fill="#4ade80" />
              <Bar dataKey="pending" fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow flex flex-col items-center justify-center text-center">
          <h3 className="text-xl font-semibold mb-4">🌟 Overall Completion</h3>
          <div className="relative w-40 h-40">
            <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
                fill="none"
                stroke="#6366f1"
                strokeWidth="3"
                strokeDasharray={`${completionRate}, 100`}
              />
            </svg>
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {completionRate}%
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
            You're leveling up big time 🚀
          </p>
        </div>
      </div>
    </div>
  );
}
