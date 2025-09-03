// =====================
// controllers/like.controller.js
// =====================

import Like from "../models/like.model.js";
import Post from "../models/blog.model.js";
import asyncHandler from "../middlewares/asyncHandler.middleware.js";


// validate reaction type
const validateReaction = (reaction) => {
  return ["like", "dislike"].includes(reaction);
};


/* ---------- Helpers ---------- */

// update post counts
const updateCounts = asyncHandler( async (blogId) => {
  const likes = await Like.countDocuments({ blogId, reaction: "like" });
  const dislikes = await Like.countDocuments({ blogId, reaction: "dislike" });
  await Post.findByIdAndUpdate(blogId, { likesCount: likes, dislikesCount: dislikes });
  return { likes, dislikes };
});
/* ---------- Controllers ---------- */

// Toggle reaction (like/dislike)
export const toggleReaction = asyncHandler ( async (req, res) => {
  try {
    const { blogId } = req.params;
    const { reaction } = req.body; // "like" or "dislike"
    const userId = req.user._id; // comes from auth middleware

    if (!validateReaction(reaction)) {
      return res.status(400).json({ error: "Invalid reaction type" });
    }

    const existing = await Like.findOne({ user: userId, blogId });

    if (existing) {
      if (existing.reaction === reaction) {
        // remove reaction
        await existing.deleteOne();
        const counts = await updateCounts(blogId);
        return res.json({ message: `Removed ${reaction}`, ...counts });
      } else {
        // switch reaction
        existing.reaction = reaction;
        await existing.save();
        const counts = await updateCounts(blogId);
        return res.json({ message: `Changed to ${reaction}`, ...counts });
      }
    } else {
      // new reaction
      await Like.create({ user: userId, blogId, reaction });
      const counts = await updateCounts(blogId);
      return res.json({ message: `Added ${reaction}`, ...counts });
    }
  } catch (err) {
    console.error("toggleReaction error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Remove reaction
export const removeReaction = asyncHandler ( async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = req.user._id;

    await Like.findOneAndDelete({ user: userId, blogId });

    const { likes, dislikes } = await updatePostCounts(blogId);

    res.json({
      message: "Reaction removed",
      likesCount: likes,
      dislikesCount: dislikes,
    });
  } catch (err) {
    console.error("Error in removeReaction:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all reactions of a post
export const getReactions = asyncHandler ( async (req, res) => {
  try {
    const { blogId } = req.params;

    const reactions = await Like.find({ blogId })
      .populate("userInfo", "username email") // from virtual
      .select("reaction user createdAt");

    const { likes, dislikes } = await updatePostCounts(blogId);

    res.json({
      blogId,
      likesCount: likes,
      dislikesCount: dislikes,
      reactions,
    });
  } catch (err) {
    console.error("Error in getReactions:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Get user’s reaction on a post
export const getUserReaction = asyncHandler ( async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = req.user._id;

    const reaction = await Like.findOne({ user: userId, blogId });

    res.json({
      blogId,
      user: userId,
      reaction: reaction ? reaction.reaction : null,
    });
  } catch (err) {
    console.error("Error in getUserReaction:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});
