import express from "express";

import {
  login,
  logout,
  me,
  signup,
  updateProfile,
} from "../controllers/auth.controllers.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", protectRoute, updateProfile);
router.get("/me", protectRoute, me);

export default router;
