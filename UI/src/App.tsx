import { useEffect, useState } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "./services/api";
import type { Task } from "./services/api";
import { countPendingTasks, filterTasks } from "./taskFilters";
import type { TaskFilter } from "./taskFilters";

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
    <main className="container task-page py-4 py-sm-5">
      <h1>My tasks</h1>
      <div>
        {loading ? <p>Loading tasks...</p> : loadError ? (
          <div className="alert alert-danger mb-0">
            <p>Could not load your tasks. Please try again.</p>
            <button className="btn btn-outline-danger" onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : (
          <>
            <form onSubmit={(event) => {
              event.preventDefault();
              addTask();
            }}>
              <label htmlFor="task-title">New task</label>
              <div className="d-flex flex-column flex-sm-row gap-2 py-3">
                <input className="form-control" id="task-title" type="text" placeholder="Write a task"
                  value={title} onChange={(event) => setTitle(event.target.value)}
                  disabled={saving} required />
                <button className="btn btn-primary px-4" type="submit" disabled={saving}>Add</button>
              </div>
            </form>

            {error && <p>{error}</p>}
            {saving && <p>Saving...</p>}
            <div className="d-flex flex-wrap justify-content-between">
              <p>Pending: {countPendingTasks(tasks)}</p>
              <div>
                <select id="task-filter" value={filter}
                  onChange={(event) => setFilter(event.target.value as TaskFilter)}>
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            {tasks.length === 0 ? (
                <p>No tasks yet.</p>
              ) : visibleTasks.length === 0 ? (
                <p>No tasks for this filter.</p>
              ) : (
              <ul className="list-group">
                {visibleTasks.map((task) => (
                  <li className="list-group-item d-flex align-items-center justify-content-between gap-3 py-3" key={task.id}>
                    <label className="task-label d-flex align-items-start gap-2">
                      <input className="form-check-input flex-shrink-0" type="checkbox" checked={task.completed}
                        disabled={saving} onChange={() => toggleTask(task)} />
                      <span className={task.completed ? "text-decoration-line-through text-secondary" : ""}>
                        {task.title}
                      </span>
                    </label>
                    <button className="btn btn-outline-danger btn-sm flex-shrink-0" type="button" disabled={saving}
                      onClick={() => removeTask(task.id)}>Delete</button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </main>
  );
}
