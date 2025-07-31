import { useEffect, useState } from "react";
import axios from "axios";

export default function Settings() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [reminders, setReminders] = useState(true);
  const [user, setUser] = useState({ name: "", email: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [message, setMessage] = useState("");

  // Apply theme to <html> tag globally
  const applyTheme = (mode) => {
    const root = document.documentElement;
    root.classList.toggle("dark", mode === "dark");
  };

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setForm(res.data);
      } catch (err) {
        console.error("Failed to fetch user data", err);
      }
    };
    fetchUser();
  }, []);

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch("http://localhost:5000/api/users/me", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setIsEditing(false);
      setMessage("✅ Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Update failed", error);
      setMessage("❌ Failed to update profile");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF3FF] to-[#E0ECFF] dark:from-[#1e1e2f] dark:to-[#0f172a] flex justify-center px-6 py-12">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-900 text-black dark:text-white shadow-2xl rounded-2xl p-8 space-y-10">
        <div>
          <h2 className="text-4xl font-bold text-purple-700 dark:text-purple-400">⚙️ Settings</h2><br />
          <p className="text-gray-500 dark:text-gray-300">Personalize your StudyVerse experience 🚀</p>
        </div>

        {/* Profile Section */}
        <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-xl font-semibold text-purple-600 dark:text-purple-400">👤 Profile</h3>
          <div className="flex items-center gap-4 p-4 rounded-lg bg-purple-50 dark:bg-purple-900 border border-purple-100 dark:border-purple-800 shadow-sm">
            <div className="text-4xl">🧠</div>
            <div className="flex-1 space-y-1">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border rounded px-3 py-1 dark:bg-gray-800 dark:border-gray-700"
                  />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border rounded px-3 py-1 dark:bg-gray-800 dark:border-gray-700"
                  />
                </>
              ) : (
                <>
                  <p className="text-lg font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                </>
              )}
              <div className="mt-1">
                {isEditing ? (
                  <button onClick={handleSave} className="text-sm text-green-600 hover:underline">
                    💾 Save
                  </button>
                ) : (
                  <button onClick={handleEdit} className="text-sm text-blue-600 hover:underline">
                    ✏️ Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
          {message && <p className="text-sm text-center mt-2 text-purple-600 dark:text-purple-300">{message}</p>}
        </div>

        {/* Theme Toggle */}
        <div className="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-xl font-semibold text-purple-600 dark:text-purple-400">🌗 Theme</h3>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
          >
            <option value="light">🌞 Light</option>
            <option value="dark">🌙 Dark</option>
          </select>
        </div>

        {/* Reminders */}
        <div className="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-purple-600 dark:text-purple-400">🔔 Productivity Reminders</h3>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={reminders}
              onChange={() => setReminders(!reminders)}
              className="accent-purple-600 w-5 h-5"
            />
            <span className="text-sm">{reminders ? "On" : "Off"}</span>
          </label>
        </div>

        {/* Logout */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 text-center">
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-full shadow"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}
