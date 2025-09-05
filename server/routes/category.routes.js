// import express from 'express'
// import { addCategory, deleteCategory, getAllCategory, showCategory, updateCategory } from '../controllers/Category.controller.js'
// import { onlyadmin } from '../middleware/onlyadmin.js'

import { Router } from "express";
// import { addCategory, deleteCategory, getAllCategory, showCategory, updateCategory } from "../controllers/category.container.js";
import { getAllCategory, addCategory, updateCategory,deleteCategory, showCategory } from "../controllers/category.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import { userLimiter } from "../middlewares/ratelimiter.middleware.js";

// const CategoryRoute = express.Router()

// CategoryRoute.post('/add', onlyadmin, addCategory)
// CategoryRoute.put('/update/:categoryid', onlyadmin, updateCategory)
// CategoryRoute.get('/show/:categoryid', onlyadmin, showCategory)
// CategoryRoute.delete('/delete/:categoryid', onlyadmin, deleteCategory)
// CategoryRoute.get('/all-category', getAllCategory)


// export default CategoryRoute

const router = Router();

router
    .route('/')
        .get( userLimiter , getAllCategory)
        .post(upload.single('thumbnail'), userLimiter, addCategory);

router
    .route('/:categoryid')
        .get(isLoggedIn, userLimiter, showCategory)
        .put(isLoggedIn, upload.single('thumbnil'), userLimiter, updateCategory)
        .delete(isLoggedIn, userLimiter, deleteCategory);

export default router;
