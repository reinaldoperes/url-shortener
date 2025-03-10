import express from "express";
import cors from "cors";
import { authRoutes } from "./presentation/routes/authRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

export default app;
