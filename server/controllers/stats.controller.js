import asyncHandler from '../middlewares/asyncHandler.middleware.js';
import Post from '../models/blog.model.js';
import Like from '../models/like.model.js';
import Comment from '../models/comment.model.js';

export const getTotals = asyncHandler(async (req, res, next) => {
    // totals: totalLikes, totalComments, totalViews
    const totalLikes = await Like.countDocuments({});
    const totalComments = await Comment.countDocuments({});

    // sum views across posts (fast enough for small datasets)
    const agg = await Post.aggregate([{
             $group: { _id: null, totalViews: { $sum: { $ifNull: ["$views", 0] } } } }
    ]);

    const totalViews = (agg && agg[0] && agg[0].totalViews) || 0;

    res.status(200).json({
        success: true,
        totals: {
            likes: totalLikes,
            comments: totalComments,
            views: totalViews
        }
    });
});
