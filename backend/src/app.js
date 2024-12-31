import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import connectDB from "./lib/db.js";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import { globalErrorHandlingMiddleware } from "./controllers/error.controllers.js";
import AppError from "./lib/AppError.js";
import { app, server } from "./socket.js";

dotenv.config({ path: "./config.env" });
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
app.all("*", (req, _, next) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server!`, 404)
  );
});

const __dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(__dirname, "../../frontend/dist"));

  app.get("*", (_, res) => {
    res.send(path.join(__dirname, "../../frontend", "dist", "index.html"));
  });
}

// Error Handling Middleware
app.use(globalErrorHandlingMiddleware);

const PORT = process.env.PORT;
server.listen(PORT, async () => {
  await connectDB();
  console.log(`App is running on http://localhost:${PORT}`);
});
