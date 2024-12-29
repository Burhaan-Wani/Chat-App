import { decode } from "punycode";
import AppError from "../lib/AppError.js";
import catchAsync from "../lib/catchAsync.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { promisify } from "util";

export const protectRoute = catchAsync(async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next(new AppError("Unauthorized access - No Token Provided", 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.userId).select("-password");
  if (!user) {
    return next(new AppError("Unauthorized access- User not found", 404));
  }
  req.user = user;
  next();
});
