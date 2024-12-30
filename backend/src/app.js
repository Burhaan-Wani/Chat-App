import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import { globalErrorHandlingMiddleware } from "./controllers/error.controllers.js";
import AppError from "./lib/AppError.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/messages", messageRoutes);

// Unhandled routes
app.all("*", (req, res, next) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server!`, 404)
  );
});

// Error Handling Middleware
app.use(globalErrorHandlingMiddleware);

export default app;
