import { Router } from 'express';
import { authorizeRoles, isLoggedIn } from '../middlewares/auth.middleware.js';
import { addComment, createPost, deleteComment, deletePost, getAllPosts, getCommentsForPost, getPostbyid, updatePost, updateComment } from '../controllers/post.controller.js';
import upload from '../middlewares/multer.middleware.js';

const router = Router();


// blog post routes

router
    .route('/')
    .get(getAllPosts)
    .post(upload.single('thumbnail') , createPost)


router
    .route('/:id')
    .get(isLoggedIn, getPostbyid)
    .put(isLoggedIn,  upload.single('thumbnail'), updatePost)
    .delete(isLoggedIn, deletePost)
    .delete(isLoggedIn, deleteComment);

router
    .route('/:id/comments')
    .get(getCommentsForPost)
    .post(isLoggedIn, upload.single('thumbnail'), addComment)
    .put(isLoggedIn, upload.single('thumbnail'), updateComment);


export default router;
