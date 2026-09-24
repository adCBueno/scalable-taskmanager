import express from "express";
import { ObjectId } from "mongodb";

function toTask(document) {
  return {
    id: document._id.toString(),
    title: document.title,
    completed: document.completed,
  };
}

export function createApp(tasksCollection) {
  const app = express();
  app.use(express.json());

  app.get("/api/tasks", async (_req, res) => {
    const documents = await tasksCollection.find({}).sort({ _id: 1 }).toArray();
    res.json(documents.map(toTask));
  });

  app.post("/api/tasks", async (req, res) => {
    const { title } = req.body ?? {};
    if (typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({ error: "Write a title for the task." });
    }
    const task = { title: title.trim(), completed: false };
    const result = await tasksCollection.insertOne(task);
    res.status(201).json(toTask({ ...task, _id: result.insertedId }));
  });

  app.param("id", (_req, res, next, id) => {
    if (!/^[a-f\d]{24}$/i.test(id)) {
      return res.status(400).json({ error: "Invalid task identifier." });
    }
    next();
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    const { completed } = req.body ?? {};
    if (typeof completed !== "boolean") {
      return res.status(400).json({ error: "completed must be a boolean." });
    }
    const task = await tasksCollection.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: { completed } },
      { returnDocument: "after" },
    );
    if (!task) return res.status(404).json({ error: "The task does not exist." });
    res.json(toTask(task));
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    const result = await tasksCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "The task does not exist." });
    }
    res.status(204).end();
  });

  app.use((error, req, res, _next) => {
    console.error(`[Server Error] ${req.method} ${req.path} failed:`, error);
    res.status(500).json({ error: "Internal server error" });
  });

  return app;
}
