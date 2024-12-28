import AppError from "../lib/AppError.js";
import catchAsync from "../lib/catchAsync.js";
import { signupSchema } from "../lib/zod/signupSchema.js";

// signup
export const signup = catchAsync((req, res, next) => {
  const { success, error } = signupSchema.safeParse(req.body);
  if (!success) {
    const err = error.errors.map(error => error.message).join(". ");
    return next(new AppError(err, 400));
  }
  res.send("hi");
});

// login
export const login = (req, res) => {};

// logout
export const logout = (req, res) => {};
