import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaTasks,
  FaChartPie,
  FaUser,
  FaCog,
} from "react-icons/fa";

export default function Sidebar() {
  const links = [
    { name: "Dashboard", icon: <FaTachometerAlt />, to: "/dashboard" },
    { name: "Tasks", icon: <FaTasks />, to: "/tasks" },
    { name: "Calendar", icon: <FaCalendarAlt />, to: "/calendar" },
    { name: "Stats", icon: <FaChartPie />, to: "/stats" },
    { name: "Pomodoro", icon: <FaUser />, to: "/pomodoro" },
    { name: "Settings", icon: <FaCog />, to: "/settings" },
  ];

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-indigo-700 to-purple-800 dark:from-gray-900 dark:to-gray-800 text-white shadow-lg flex flex-col">
      <div className="text-3xl font-extrabold tracking-wide p-6 border-b border-indigo-500 dark:border-gray-700">
        StudyVerse
      </div>
      <nav className="flex flex-col gap-1 p-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition duration-200 ${
                isActive
                  ? "bg-white/20 dark:bg-gray-700 font-semibold"
                  : "hover:bg-white/10 dark:hover:bg-gray-700/50"
              }`
            }
          >
            <span className="text-lg">{link.icon}</span>
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
