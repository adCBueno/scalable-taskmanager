import { MongoClient } from "mongodb";
import { createApp } from "./app.js";

const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const dbName = process.env.MONGODB_DATABASE || "taskmanager_learning";
const port = Number(process.env.PORT || 3002);

const client = new MongoClient(mongoUri, { 
  serverSelectionTimeoutMS: 5000 
});

try {
  await client.connect();
  console.log("Connected successfully to MongoDB");

  const database = client.db(dbName);
  const app = createApp(database.collection("tasks"));

  app.listen(port, "0.0.0.0", () => {
    console.log(`API backend running at http://127.0.0.1:${port}`);
  });
} catch (error) {
  console.error("Error: Could not start the backend server:", error.message);
  process.exit(1); 
}
