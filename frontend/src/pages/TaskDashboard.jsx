import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function TaskDashboard() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const { data } = await axios.post("/api/v1/user/getAllTask");
      setTasks(data.data || []);
    } catch {
      setError("Failed to load tasks");
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const createTask = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    try {
      await axios.post("/api/v1/user/createTask", form);
      setForm({ title: "", description: "" });
      setShowForm(false);
      fetchTasks();
    } catch {
      setError("Failed to create task");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.post("/api/v1/user/deleteTask", { taskId });
      fetchTasks();
    } catch {
      setError("Failed to delete task");
    }
  };

  const toggleComplete = async (taskId) => {
    try {
      await axios.post("/api/v1/user/markAsComplete", { taskId });
      fetchTasks();
    } catch {
      setError("Failed to update task");
    }
  };

  const handleLogout = async () => {
    try { await axios.post("/api/v1/user/logout"); } catch {}
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
          <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-red-500 transition">
            Logout
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Add Task Button */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="mb-4 w-full border-2 border-dashed border-blue-300 text-blue-400 hover:border-blue-400 hover:text-blue-500 py-2 rounded-lg text-sm transition"
        >
          {showForm ? "Cancel" : "+ New Task"}
        </button>

        {/* Create Task Form */}
        {showForm && (
          <form onSubmit={createTask} className="bg-white border rounded-lg p-4 mb-4 space-y-3">
            <input
              type="text"
              placeholder="Task title *"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Description (optional)"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm font-medium transition"
            >
              Add Task
            </button>
          </form>
        )}

        {/* Task List */}
        {tasks.length === 0 ? (
          <div className="text-center text-gray-400 mt-24 text-sm">
            <p className="text-4xl mb-3">📋</p>
            No tasks created yet
          </div>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li key={task._id} className="bg-white border rounded-lg px-4 py-3 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleComplete(task._id)}
                      className="mt-1 w-4 h-4 accent-blue-500 cursor-pointer"
                    />
                    <div>
                      <p className={`text-sm font-medium ${task.completed ? "line-through text-gray-400" : "text-gray-700"}`}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-xs text-gray-400 mt-0.5">{task.description}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="text-gray-300 hover:text-red-400 text-xs transition shrink-0"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}