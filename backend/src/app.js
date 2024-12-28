import express from "express";

import authRoutes from "./routes/auth.routes.js";
import { globalErrorHandlingMiddleware } from "./controllers/error.controllers.js";
import AppError from "./lib/AppError.js";

const app = express();
app.use(express.json());

// routes
app.use("/api/v1/auth", authRoutes);

// Unhandled routes
app.all("*", (req, res, next) => {
  return next(new AppError("This route is yet to be defined", 404));
});

// Error Handling Middleware
app.use(globalErrorHandlingMiddleware);

export default app;
