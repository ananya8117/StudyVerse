import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaTrash,
  FaEdit,
  FaCheckCircle,
  FaPlus,
  FaSave,
  FaTimes,
} from "react-icons/fa";

const API_URL = "http://localhost:5000/api/tasks";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
  });
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskData, setEditTaskData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks", err);
    }
  };

  const handleAdd = async () => {
    const { title, dueDate } = newTask;
    if (!title || !dueDate) {
      alert("Please fill in both title and due date.");
      return;
    }

    try {
      const res = await axios.post(API_URL, newTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks([res.data, ...tasks]);
      setNewTask({ title: "", description: "", dueDate: "", priority: "Medium" });
    } catch (err) {
      console.error("Error adding task", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      console.error("Error deleting task", err);
    }
  };

  const handleToggle = async (id) => {
    const task = tasks.find((t) => t._id === id);
    try {
      const res = await axios.put(
        `${API_URL}/${id}`,
        { completed: !task.completed },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks(tasks.map((t) => (t._id === id ? { ...t, completed: res.data.completed } : t)));
    } catch (err) {
      console.error("Error updating task", err);
    }
  };

  const handleEditStart = (task) => {
    setEditTaskId(task._id);
    setEditTaskData({
      title: task.title,
      description: task.description || "",
      dueDate: task.dueDate?.slice(0, 10),
      priority: task.priority || "Medium",
    });
  };

  const handleEditSave = async (id) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, editTaskData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.map((t) => (t._id === id ? { ...t, ...res.data } : t)));
      setEditTaskId(null);
    } catch (err) {
      console.error("Error saving task edits", err);
    }
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (statusFilter === "completed") return task.completed;
      if (statusFilter === "pending") return !task.completed;
      return true;
    })
    .filter((task) => {
      if (priorityFilter === "all") return true;
      return task?.priority?.toLowerCase() === priorityFilter.toLowerCase();
    })
    .filter((task) => task?.title?.toLowerCase().includes(search.toLowerCase()));

  const completedCount = tasks.filter((t) => t.completed).length;
  const progress = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  const priorityColor = {
    High: "text-red-600 dark:text-red-400",
    Medium: "text-yellow-600 dark:text-yellow-400",
    Low: "text-green-600 dark:text-green-400",
  };

  return (
    <div className="p-4 space-y-8">
      <h2 className="text-3xl font-bold dark:text-white">📚 Tasks</h2>

      {/* Add Task */}
      <div className="bg-white dark:bg-gray-800 dark:text-white p-4 rounded shadow space-y-4">
        <h3 className="text-xl font-semibold">Add New Task</h3>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <input
            type="date"
            value={newTask.dueDate}
            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <select
            value={newTask.priority}
            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <button
            onClick={handleAdd}
            className="bg-indigo-600 text-white p-2 rounded flex items-center justify-center gap-2"
          >
            <FaPlus /> Add
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2 flex-wrap items-center">
          {["all", "completed", "pending"].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1 rounded ${
                statusFilter === f
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 dark:bg-gray-600 dark:text-white"
              } capitalize`}
            >
              {f}
            </button>
          ))}

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded w-full sm:w-60 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      {/* Progress Bar */}
      <div className="bg-white dark:bg-gray-800 dark:text-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Progress</h3>
        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
          <div
            className="bg-indigo-600 h-4 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{progress}% complete</p>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No tasks found.</p>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task._id}
              className="bg-white dark:bg-gray-800 dark:text-white p-4 rounded shadow flex justify-between items-center"
            >
              {editTaskId === task._id ? (
                <div className="flex flex-col w-full space-y-2">
                  <input
                    type="text"
                    value={editTaskData.title}
                    onChange={(e) => setEditTaskData({ ...editTaskData, title: e.target.value })}
                    className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <input
                    type="date"
                    value={editTaskData.dueDate}
                    onChange={(e) => setEditTaskData({ ...editTaskData, dueDate: e.target.value })}
                    className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Description (optional)"
                    value={editTaskData.description}
                    onChange={(e) =>
                      setEditTaskData({ ...editTaskData, description: e.target.value })
                    }
                    className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <select
                    value={editTaskData.priority}
                    onChange={(e) => setEditTaskData({ ...editTaskData, priority: e.target.value })}
                    className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditSave(task._id)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      <FaSave /> Save
                    </button>
                    <button
                      onClick={() => setEditTaskId(null)}
                      className="bg-gray-400 text-white px-3 py-1 rounded"
                    >
                      <FaTimes /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <h4
                      className={`text-lg font-semibold ${
                        task.completed ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {task.title}
                    </h4>
                    {task.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300">{task.description}</p>
                    )}
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Due:{" "}
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "No due date"}
                    </p>
                    <p className={`text-sm font-semibold ${priorityColor[task.priority]}`}>
                      {task.priority || "Medium"} Priority
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xl">
                    <button onClick={() => handleToggle(task._id)} title="Toggle">
                      <FaCheckCircle
                        className={task.completed ? "text-green-600" : "text-gray-400 dark:text-gray-500"}
                      />
                    </button>
                    <button onClick={() => handleEditStart(task)} title="Edit">
                      <FaEdit className="text-blue-500" />
                    </button>
                    <button onClick={() => handleDelete(task._id)} title="Delete">
                      <FaTrash className="text-red-600" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
