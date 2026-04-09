import express from "express";
import {
  createMessage,
  getAllMessages,
  getMessageStats,
  getSingleMessage,
  markAsRead,
  replyToMessage,
  archiveMessage,
  deleteMessage,
} from "../controllers/messages.controller.js";

const router = express.Router();

// Public contact form
router.post("/", createMessage);

// Admin routes
router.get("/", getAllMessages);
router.get("/stats/summary", getMessageStats);
router.get("/:id", getSingleMessage);
router.patch("/:id/read", markAsRead);
router.patch("/:id/reply", replyToMessage);
router.patch("/:id/archive", archiveMessage);
router.delete("/:id", deleteMessage);

export default router;