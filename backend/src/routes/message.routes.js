import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
  getMessages,
  getUsers,
  sendMessage,
} from "../controllers/message.controllers.js";

const router = express.Router();

router.get("/users", protectRoute, getUsers);
router.get("/:id", protectRoute, getMessages);
router.get("/send/:id", protectRoute, sendMessage);
export default router;