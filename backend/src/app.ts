import express from "express";
import cors from "cors";
import { authRoutes } from "./presentation/routes/authRoutes.js";
import { urlRoutes } from "./presentation/routes/urlRoutes.js";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/url", urlRoutes);
app.use("/", urlRoutes);

export default app;
