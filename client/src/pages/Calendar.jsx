import { useEffect, useState } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Dialog } from "@headlessui/react";

const API_URL = "http://localhost:5000/api/tasks";

const priorityColors = {
  High: "#ef4444",
  Medium: "#facc15",
  Low: "#4ade80",
};

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState("Low");
  const [editCompleted, setEditCompleted] = useState(false);
  const token = localStorage.getItem("token");

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const taskEvents = res.data.map((task) => ({
        id: task._id,
        title: task.title,
        start: task.dueDate,
        backgroundColor: priorityColors[task.priority] || "#60a5fa",
        borderColor: priorityColors[task.priority] || "#60a5fa",
        textColor: "#1f2937",
        extendedProps: {
          priority: task.priority,
          description: task.description,
          completed: task.completed,
        },
      }));

      setEvents(taskEvents);
    } catch (err) {
      console.error("Error loading tasks", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleEventClick = (clickInfo) => {
    const task = {
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      ...clickInfo.event.extendedProps,
    };
    setSelectedTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditPriority(task.priority);
    setEditCompleted(task.completed);
    setIsOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${selectedTask.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsOpen(false);
      fetchTasks();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `${API_URL}/${selectedTask.id}`,
        {
          title: editTitle,
          description: editDescription,
          priority: editPriority,
          completed: editCompleted,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsOpen(false);
      fetchTasks();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const renderEventContent = (eventInfo) => (
    <div
      style={{
        padding: "4px 8px",
        backgroundColor: eventInfo.backgroundColor,
        borderRadius: "8px",
        fontWeight: 600,
        color: "#1f2937",
        fontSize: "0.85rem",
      }}
    >
      {eventInfo.event.title}
    </div>
  );

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-3xl font-bold dark:text-white">🗓️ Calendar</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-2 italic">
        Goals? Slayed. Priorities? Sorted. Your schedule’s a masterpiece.
      </p>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          height="auto"
          events={events}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          dayHeaderClassNames={() =>
            "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold border-b dark:border-gray-600 py-2"
          }
          dayCellClassNames={() =>
            "text-gray-800 dark:text-gray-200 border dark:border-gray-700"
          }
        />
      </div>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow-xl space-y-4">
            <Dialog.Title className="text-xl font-bold">✏️ Edit Task</Dialog.Title>

            <div className="space-y-2">
              <input
                type="text"
                className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Task Title"
              />
              <textarea
                className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Description"
              />
              <select
                className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value)}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editCompleted}
                  onChange={(e) => setEditCompleted(e.target.checked)}
                />
                Mark as Completed
              </label>
            </div>

            <div className="flex justify-between mt-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={handleDelete}
              >
                Delete
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={handleUpdate}
              >
                Save
              </button>
              <button
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 dark:text-white text-gray-800 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
