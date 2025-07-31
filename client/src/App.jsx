import { useEffect, useState } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import Tasks from "./pages/Tasks";
import Stats from "./pages/Stats";
import Pomodoro from "./pages/Pomodoro";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";

// 🛡️ Protected layout with sidebar
function ProtectedLayout({ isAuthenticated }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex dark:bg-gray-900 dark:text-white">
      <Sidebar />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 p-6 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ✅ Ensure theme is applied once at mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  return (
    <Routes>
      {/* 🔓 Public routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
      <Route path="/register" element={<Register />} />

      {/* 🔒 Protected routes */}
      <Route element={<ProtectedLayout isAuthenticated={isAuthenticated} />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/pomodoro" element={<Pomodoro />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
