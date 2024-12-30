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
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const updateUserSchema = z.object({
  fullName: z.string().min(1, { message: "FullName is required" }),
  profilePic: z.string().optional(),
});

export const messageSchema = z.object({
  text: z
    .string()
    .min(1, { message: "Message must be atleast one character long" }),
  image: z.string().optional(),
});
