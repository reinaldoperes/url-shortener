import express from "express";
import cors from "cors";
import { swaggerDocs } from "./presentation/docs/swagger.js";
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

// Swagger docs
app.use(swaggerDocs);

// Auth routes
app.use("/api/auth", authRoutes);

// URL routes
app.use("/api/url", urlRoutes);
app.use("/", urlRoutes);

export default app;
