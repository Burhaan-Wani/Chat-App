import { z } from "zod";

export const signupSchema = z.object({
  fullName: z
    .string({ required_error: "FullName is required" })
    .min(5, { message: "Name must be atleast 5 characters long" }),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(7, { message: "Password must be atleast 7 characters long" }),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z.string({ required_error: "Password is required" }),
});

export const updateUserSchema = z.object({
  fullName: z.string({ required_error: "FullName is required" }),
  profilePic: z.string().optional(),
});
