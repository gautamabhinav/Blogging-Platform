// =====================
// routes/like.routes.js
// =====================

import express from "express";
import {
  toggleReaction,
  removeReaction,
  getReactions,
  getUserReaction,
} from "../controllers/like.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js"; // assuming you have an auth middleware

const router = express.Router();

// Toggle like/dislike
router.post("/:blogId/toggle", isLoggedIn, toggleReaction);

// Remove reaction
router.delete("/:blogId/remove", isLoggedIn, removeReaction);

// Get all reactions of a post
router.get("/:blogId", getReactions);

// Get current user’s reaction on a post
router.get("/:blogId/me", isLoggedIn, getUserReaction);

export default router;
