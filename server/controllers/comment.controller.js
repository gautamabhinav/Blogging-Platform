// =====================
// controllers/comment.controller.js
// =====================

import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import Comment from "../models/comment.model.js";
/* ---------- Helpers ---------- */

// update replies count when a reply is added/removed
const updateRepliesCount = asyncHandler ( async (parentId) => {
  if (parentId) {
    const replies = await Comment.countDocuments({ parentId });
    await Comment.findByIdAndUpdate(parentId, { repliesCount: replies });
  }
});

/* ---------- Controllers ---------- */

// 1. Add a new comment (or reply)
export const addComment = asyncHandler ( async (req, res) => {
  try {
    const { blogid } = req.params;
    const { comment, parentId } = req.body;
    const userId = req.user._id;

    const newComment = await Comment.create({
      user: userId,
      blogid,
      comment,
      parentId: parentId || null,
    });

    // update replies count if it's a reply
    if (parentId) await updateRepliesCount(parentId);

    res.status(201).json({ message: "Comment added", comment: newComment });
  } catch (err) {
    console.error("Error in addComment:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// 2. Get all comments for a blog post
export const getCommentsByPost = asyncHandler ( async (req, res) => {
  try {
    const { blogid } = req.params;

    const comments = await Comment.find({ blogid, parentId: null })
      .populate("user", "username email")
      .sort({ createdAt: -1 });

    res.json({ blogid, comments });
  } catch (err) {
    console.error("Error in getCommentsByPost:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// 3. Get replies for a specific comment
export const getReplies = asyncHandler ( async (req, res) => {
  try {
    const { commentId } = req.params;

    const replies = await Comment.find({ parentId: commentId })
      .populate("user", "username email")
      .sort({ createdAt: 1 });

    res.json({ commentId, replies });
  } catch (err) {
    console.error("Error in getReplies:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// 4. Delete a comment
export const deleteComment = asyncHandler ( async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.user.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await comment.deleteOne();

    // update parent’s replies count if it was a reply
    if (comment.parentId) await updateRepliesCount(comment.parentId);

    res.json({ message: "Comment deleted" });
  } catch (err) {
    console.error("Error in deleteComment:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});


/**
 * Update a comment
 */
export const updateComment = asyncHandler ( async (req, res) => {
  try {
    const { commentId } = req.params;
    const { comment } = req.body;
    const userId = req.user._id;

    const existing = await Comment.findOne({ _id: commentId, user: userId });
    if (!existing) {
      return res.status(404).json({ error: "Comment not found or not authorized" });
    }

    existing.comment = comment;
    await existing.save();

    res.json({ message: "Comment updated", comment: existing });
  } catch (err) {
    console.error("Error in updateComment:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// 5. Like a comment
export const likeComment = asyncHandler ( async (req, res) => {
  try {
    const { commentId } = req.params;

    await Comment.findByIdAndUpdate(commentId, { $inc: { likesCount: 1 } });

    const updated = await Comment.findById(commentId).select("likesCount");

    res.json({ message: "Comment liked", likesCount: updated.likesCount });
  } catch (err) {
    console.error("Error in likeComment:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});
