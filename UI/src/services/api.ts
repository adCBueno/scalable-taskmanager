export type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export async function getTasks(): Promise<Task[]> {
  const response = await fetch("/gateway/tasks");
  if (!response.ok) {
    throw new Error(`Could not load tasks (${response.status})`);
  }
  return response.json();
}

export async function createTask(title: string): Promise<Task> {
  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!response.ok) {
    throw new Error(`Could not create the task (${response.status})`);
  }
  return response.json();
}

export async function updateTask(id: string, completed: boolean): Promise<Task> {
  const response = await fetch(`/api/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });
  if (!response.ok) {
    throw new Error(`Could not update the task (${response.status})`);
  }
  return response.json();
}

export async function deleteTask(id: string): Promise<void> {
  const response = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
  if (!response.ok) {
    throw new Error(`Could not delete the task (${response.status})`);
  }
}
