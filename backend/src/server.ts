import app from "./app.js";
import { connectDB } from "./infrastructure/database/mongo.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`* Server is running on http://localhost:${PORT}`);
  });
}

startServer();
