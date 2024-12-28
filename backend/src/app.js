import express from "express";

import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use("/api/v1/auth", authRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});
export default app;
