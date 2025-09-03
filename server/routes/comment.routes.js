// =====================
// routes/comment.routes.js
// =====================

import express from "express";
import {
  addComment,
  getCommentsByPost,
  getReplies,
  updateComment,
  deleteComment,
  likeComment,
} from "../controllers/comment.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Create a new comment
router.post("/:blogId", isLoggedIn, addComment);

// Get all comments for a post
router.get("/:blogId", getCommentsByPost);

// Reply to a comment
router.post("/reply/:commentId", isLoggedIn, getReplies);

// Update a comment
router.put("/:commentId", isLoggedIn, updateComment);

// Delete a comment
router.delete("/:commentId", isLoggedIn, deleteComment);

router.post("/like/:commentId", isLoggedIn, likeComment);

export default router;
