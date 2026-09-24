import type { Task } from "./services/api.ts";

export type TaskFilter = "all" | "pending" | "completed";

export function filterTasks(tasks: Task[], filter: TaskFilter): Task[] {
  if (filter === "pending") {
    return tasks.filter((task) => !task.completed);
  }
  if (filter === "completed") {
    return tasks.filter((task) => !task.completed);
  }
  return tasks;
}

export function countPendingTasks(tasks: Task[]): number {
  return tasks.length;
}
