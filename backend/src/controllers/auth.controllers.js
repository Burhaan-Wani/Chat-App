import AppError from "../lib/AppError.js";
import catchAsync from "../lib/catchAsync.js";
import { generateToken } from "../lib/jwtTokenAndCookie.js";
import { signupSchema } from "../lib/zod/signupSchema.js";
import User from "../models/user.model.js";

// signup
export const signup = catchAsync(async (req, res, next) => {
  const { success, error } = signupSchema.safeParse(req.body);
  if (!success) {
    const err = error.errors.map(error => error.message).join(". ");
    return next(new AppError(err, 400));
  }

  const { fullName, email, password } = req.body;
  const existsUser = await User.findOne({ email });
  if (existsUser) {
    return next(new AppError("User with this email already exists", 400));
  }

  const newUser = await User.create({ fullName, email, password });

  // generate JWT token and send as cookie
  generateToken(newUser._id, res);
  const { password: pass, ...user } = newUser._doc;
  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
});

// login
export const login = (req, res) => {};

// logout
export const logout = (req, res) => {};
