import express from "express";

const app = express();
const port = Number(process.env.PORT ?? 3000);
const taskServiceUrl = process.env.TASK_SERVICE_URL ?? "http://127.0.0.1:3002";
app.use(express.json());

app.get("/api/tasks", async (_req, res) => {
  try {
    const response = await fetch(`${taskServiceUrl}/api/tasks`, {
      signal: AbortSignal.timeout(5000),
    });
    const tasks = await response.json();
    res.json(tasks);
  } catch (error) {
    console.error("Could not load tasks:", error);
    res.json([]);
  }
});

app.post("/api/tasks", async (req, res) => {
  try {
    const response = await fetch(`${taskServiceUrl}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: req.body?.title }),
      signal: AbortSignal.timeout(5000),
    });
    const task = await response.json();
    res.status(response.status).json(task);
  } catch (error) {
    console.error("Could not create task:", error);
    res.status(502).json({ error: "Could not reach the task service." });
  }
});

app.patch("/api/tasks/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const response = await fetch(`${taskServiceUrl}/api/tasks/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: req.body?.completed }),
      signal: AbortSignal.timeout(5000),
    });
    const task = await response.json();
    res.status(response.status).json(task);
  } catch (error) {
    console.error("Could not update task:", error);
    res.status(502).json({ error: "Could not update the task." });
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const response = await fetch(`${taskServiceUrl}/api/tasks/${encodeURIComponent(id)}`, {
      method: "DELETE",
      signal: AbortSignal.timeout(5000),
    });

    if (response.status === 204) {
      res.status(204).end();
      return;
    }

    const errorBody = await response.json();
    res.status(response.status).json(errorBody);
  } catch (error) {
    console.error("Could not delete task:", error);
    res.status(502).json({ error: "Could not delete the task." });
  }
});

app.listen(port, "127.0.0.1", () => {
  console.log(`Gateway available at http://127.0.0.1:${port}`);
});
