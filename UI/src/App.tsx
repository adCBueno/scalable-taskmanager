import { useEffect, useState } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "./services/api";
import type { Task } from "./services/api";
import { countPendingTasks, filterTasks } from "./taskFilters";
import type { TaskFilter } from "./taskFilters";
import "./App.css";

export default function App() {
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<TaskFilter>("all");
  const visibleTasks = filterTasks(tasks, filter);

  useEffect(() => {
    async function loadTasks() {
      try {
        const loadedTasks = await getTasks();
        setTasks(loadedTasks);
      } catch {
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    }
    loadTasks();
  }, []);

  async function addTask() {
    const cleanTitle = title.trim();
    if (cleanTitle === "" || saving) return;
    setSaving(true);
    setError("");
    try {
      const newTask = await createTask(cleanTitle);
      setTasks((current) => [...current, newTask]);
      setTitle("");
    } catch {
      setError("Could not add the task. Your title is still in the field.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleTask(task: Task) {
    if (saving) return;
    setSaving(true);
    setError("");
    try {
      const updatedTask = await updateTask(task.id, !task.completed);
      setTasks((current) => current.map((item) =>
        item.id === task.id ? updatedTask : item));
    } catch {
      setError("Could not update the task. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function removeTask(id: string) {
    if (saving) return;
    setSaving(true);
    setError("");
    try {
      await deleteTask(id);
      setTasks((current) => current.filter((task) => task.id !== id));
    } catch {
      setError("Could not delete the task. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main>
      <h1>My tasks</h1>
      {loading ? <p>Loading tasks...</p> : loadError ? (
        <div className="error">
          <p>Could not load your tasks. Please try again.</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      ) : (
        <>
          <form onSubmit={(event) => {
            event.preventDefault();
            addTask();
          }}>
            <label htmlFor="task-title">New task</label>
            <input id="task-title" type="text" placeholder="Write a task"
              value={title} onChange={(event) => setTitle(event.target.value)}
              disabled={saving} required />
            <button type="submit" disabled={saving}>Add</button>
          </form>

          {error && <p className="error">{error}</p>}
          {saving && <p>Saving...</p>}
          <p>Pending: {countPendingTasks(tasks)}</p>
          <label htmlFor="task-filter">Show</label>
          <select id="task-filter" value={filter}
            onChange={(event) => setFilter(event.target.value as TaskFilter)}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          {tasks.length === 0 ? (
              <p>No tasks yet.</p>
            ) : visibleTasks.length === 0 ? (
              <p>No tasks for this filter.</p>
            ) : (
            <ul>
              {visibleTasks.map((task) => (
                <li key={task.id}>
                  <label>
                    <input type="checkbox" checked={task.completed}
                      disabled={saving} onChange={() => toggleTask(task)} />
                    <span style={{ textDecoration: task.completed ? "line-through" : "none" }}>
                      {task.title}
                    </span>
                  </label>
                  <button type="button" disabled={saving}
                    onClick={() => removeTask(task.id)}>Delete</button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  );
}