import AppError from "../lib/AppError.js";

const sendDevError = (res, err) => {
  res.status(err.statusCode).json({
    status: err.status,
    err,
    message: err.message,
    stack: err.stack,
  });
};

const sendProdError = (res, err) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log("ERROR");
    res.status(err.statusCode).json({
      status: err.status,
      message: "Something went wrong",
    });
  }
};

const handleTokenExpiredError = () => {
  return new AppError("Token has expired, please log in again", 401);
};

const globalErrorHandlingMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendDevError(res, err);
  } else if (process.env.NODE_ENV === "production") {
    let error;

    if (err.name === "TokenExpiredError") error = handleTokenExpiredError(err);

    sendProdError(res, error ? error : err);
  }
};

export { globalErrorHandlingMiddleware };
