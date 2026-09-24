import express from "express";

const app = express();
const port = Number(process.env.PORT ?? 3000);
const taskServiceUrl = process.env.TASK_SERVICE_URL ?? "http://127.0.0.1:3002";

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

app.listen(port, "127.0.0.1", () => {
  console.log(`Gateway available at http://127.0.0.1:${port}`);
});
