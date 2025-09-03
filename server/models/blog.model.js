import mongoose, { Schema, model } from 'mongoose';

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    comments: {
        type: [
            {
                comment: { type: String, required: true },
                author: { type: String, required: true }
            }
        ],
        default: [] // ensures post.comments is at least []
    },
    author: {
        type: String,
        required: true,
        ref: 'User'
    },
    thumbnail: {
      public_id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category'
    },
    description: {
        type: String,
        // required: true,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: String,
        required: [true, 'Created by is required']
    },
    views: {
        type: Number,
        default: 0
    },
},
{
    timestamps: true,
}
);

const Post = model('Post', postSchema);
export default Post;



// import mongoose from "mongoose";

// const blogSchema = new mongoose.Schema({
//     author: {
//         type: mongoose.Schema.Types.ObjectId,
//         required: true,
//         ref: 'User'
//     },
//     category: {
//         type: mongoose.Schema.Types.ObjectId,
//         required: true,
//         ref: 'Category'
//     },
//     title: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     slug: {
//         type: String,
//         required: true,
//         unique: true,
//         trim: true
//     },
//     content: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     featuredImage: {
//         type: String,
//         required: true,
//         trim: true
//     },
    
// }, { timestamps: true })

// const Blog = mongoose.model('Blog', blogSchema, 'blogs')
// export default Blog 