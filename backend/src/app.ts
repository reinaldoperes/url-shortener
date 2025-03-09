import express from "express";
import cors from "cors";
// import { urlRoutes } from "./presentation/routes/UrlRoutes";
// import { errorHandler } from "./presentation/middleware/ErrorHandler";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
// app.use("/api", urlRoutes);

// Middlewares
// app.use(errorHandler);

export default app;
