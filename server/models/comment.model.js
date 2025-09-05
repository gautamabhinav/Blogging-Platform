// import mongoose, { model, Schema } from "mongoose";

// const commentSchema = new Schema({
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         required: true,
//         trim: true,
//         ref: 'User'
//     },
//     blogid: {
//         type: mongoose.Schema.Types.ObjectId,
//         required: true,
//         trim: true,
//         ref: 'Post'
//     },
//     comment: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     parentId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Comment',
//         default: null
//     },

//     // Add the following fields to track likes count and replies count
//     likesCount: {
//         type: Number,
//         default: 0
//     },
//     repliesCount: {
//         type: Number,
//         default: 0
//     }
// }, { timestamps: true })

// const Comment = model('Comment', commentSchema)
// export default Comment;



import mongoose, { model, Schema } from "mongoose";

const commentSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    blogid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Blog",
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment", // ✅ self-reference for replies
      default: null,
    },
  },
  { timestamps: true }
);

const Comment = model("Comment", commentSchema);
export default Comment;
