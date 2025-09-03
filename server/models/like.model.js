import pkg from "mongoose";

const { Schema, model, models } = pkg;

const LikeSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true, // fast lookup by user
    },
    blogId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Post",
      index: true, // fast lookup by post
    },
    reaction: {
      type: String,
      enum: ["like", "dislike"],
      required: true,
    },
  },
  { timestamps: true }
);

// Ensure 1 reaction per user per post
LikeSchema.index({ user: 1, blogId: 1 }, { unique: true });

// Optional: Static methods for clean usage
LikeSchema.statics.toggleReaction = async function (userId, blogId, reaction) {
  return this.findOneAndUpdate(
    { user: userId, blogId },
    { reaction },
    { upsert: true, new: true }
  );
};

// Optional: Virtuals for easier population
LikeSchema.virtual("userInfo", {
  ref: "User",
  localField: "user",
  foreignField: "_id",
  justOne: true,
});

LikeSchema.virtual("postInfo", {
  ref: "Post",
  localField: "blogId",
  foreignField: "_id",
  justOne: true,
});

// Prevent OverwriteModelError in dev (hot reload safe)
const Like = models.BlogLike || model("BlogLike", LikeSchema);
export default Like;
