import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [quote, setQuote] = useState("");

  const quotes = [
    "Believe you can and you're halfway there. — Theodore Roosevelt",
    "The way to get started is to quit talking and begin doing. — Walt Disney",
    "Don't watch the clock; do what it does. Keep going. — Sam Levenson",
    "Success is not final, failure is not fatal: It is the courage to continue that counts. — Winston Churchill",
    "Whether you think you can or you think you can’t, you’re right. — Henry Ford",
    "It always seems impossible until it’s done. — Nelson Mandela",
    "Do not wait to strike till the iron is hot, but make it hot by striking. — William Butler Yeats",
    "Success usually comes to those who are too busy to be looking for it. — Henry David Thoreau",
    "If you’re going through hell, keep going. — Winston Churchill",
    "You miss 100% of the shots you don’t take. — Wayne Gretzky",
  ];

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    } catch (err) {
      console.error("Failed to load dashboard", err);
      setError("Could not fetch dashboard data");
    }
  };

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user", err);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchUser();
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  if (error) return <div className="text-red-600 dark:text-red-400">{error}</div>;
  if (!data) return <div className="text-gray-600 dark:text-gray-300">Loading...</div>;

  const progressPercent = Math.round((data.completedTasks / data.totalTasks) * 100 || 0);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-lg shadow-md dark:from-gray-800 dark:to-gray-700 transition duration-300">
        <h1 className="text-3xl font-bold mb-1">
          Welcome back{user?.name ? `, ${user.name}` : ""}! 👋
        </h1>
        <p className="text-lg italic text-white/90">
          {quote || "Loading your daily motivation..."}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard label="Total Tasks" value={data.totalTasks} color="indigo" />
        <StatCard label="Completed" value={data.completedTasks} color="green" />
        <StatCard label="Upcoming" value={data.upcomingTasks.length} color="yellow" />
      </div>

      {/* Progress Bar */}
      <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">📊 Overall Progress</h2>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
          <div
            className="bg-indigo-600 h-4 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{progressPercent}% complete</p>
      </div>

      {/* Upcoming Tasks */}
      <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">🗓️ Upcoming Tasks</h2>
        <ul className="space-y-2">
          {data.upcomingTasks.map((task) => (
            <li key={task.id} className="flex justify-between border-b border-gray-200 dark:border-gray-600 pb-2">
              <span>{task.title}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(task.due).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Motivation Box */}
      <div className="bg-purple-100 dark:bg-purple-900 dark:text-purple-100 border-l-4 border-purple-600 p-4 rounded shadow">
        <p className="italic">{quote}</p>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow text-center">
      <h2 className={`text-xl font-semibold text-${color}-700 dark:text-${color}-300 mb-2`}>
        {label}
      </h2>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
