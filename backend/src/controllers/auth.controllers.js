import AppError from "../lib/AppError.js";
import catchAsync from "../lib/catchAsync.js";
import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/jwtTokenAndCookie.js";
import { loginSchema, signupSchema, updateUserSchema } from "../lib/schemas.js";
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
export const login = catchAsync(async (req, res, next) => {
  const { success, error } = loginSchema.safeParse(req.body);
  if (!success) {
    const err = error.errors.map(error => error.message).join(". ");
    return next(new AppError(err, 400));
  }

  const { email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (!userExists) {
    return next(new AppError("User with this email does not exists", 404));
  }
  if (userExists && !(await userExists.comparePasswords(password))) {
    return next(new AppError("Invalid Email or Password", 401));
  }

  // Generate token and send as cookie
  generateToken(userExists._id, res);
  const { password: pass, ...user } = userExists._doc;
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

// logout
export const logout = catchAsync((req, res) => {
  res.cookie("jwt", "", {
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({
    status: "success",
    data: {
      message: "Loggged out successfully",
    },
  });
});

// update profile
export const updateProfile = catchAsync(async (req, res, next) => {
  const { success, error } = updateUserSchema.safeParse(req.body);
  if (!success) {
    const err = error.errors.map(error => error.message).join(". ");
    return next(new AppError(err, 400));
  }

  let pic;
  if (req.body.profilePic) {
    pic = await cloudinary.uploader.upload(req.body.profilePic);
  }
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      ...req.body,
      profilePic: pic?.secure_url,
    },
    {
      new: true,
    }
  );

  const { password, ...user } = updatedUser._doc;
  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
});

// check
export const me = catchAsync(async (req, res, next) => {
  const me = await User.findById(req.user._id).select("-password");
  if (!me) {
    return new AppError("You are not logged in, please login first.", 401);
  }
  res.status(200).json({
    status: "success",
    data: {
      user: me,
    },
  });
});
