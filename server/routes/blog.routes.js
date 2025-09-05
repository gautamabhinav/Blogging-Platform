import { Router } from 'express';
import { authorizeRoles, isLoggedIn } from '../middlewares/auth.middleware.js';
import { addComment, createPost, deleteComment, deletePost, getAllPosts, getCommentsForPost, getPostbyid, updatePost, updateComment } from '../controllers/post.controller.js';
import upload from '../middlewares/multer.middleware.js';
import { userLimiter } from '../middlewares/ratelimiter.middleware.js';

const router = Router();


// blog post routes

router
    .route('/')
    .get( userLimiter, getAllPosts)
    .post(upload.single('thumbnail') , userLimiter, createPost)


router
    .route('/:id')
    .get(isLoggedIn,userLimiter, getPostbyid)
    .put(isLoggedIn,  upload.single('thumbnail'),userLimiter, updatePost)
    .delete(isLoggedIn, userLimiter, deletePost)
    .delete(isLoggedIn, userLimiter, deleteComment);

router
    .route('/:id/comments')
    .get(userLimiter, getCommentsForPost)
    .post(isLoggedIn, upload.single('thumbnail'), userLimiter, addComment)
    .put(isLoggedIn, upload.single('thumbnail'), userLimiter, updateComment);


export default router;
