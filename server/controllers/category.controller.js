// import category from "../models/category.model.js";
// import AppError from "../utils/AppError.js";

import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import Category from "../models/category.model.js";


export const getAllCategory = asyncHandler(async (req, res) => {
    const category = await Category.find({});
    console.log(category);

    res.status(200).json({
        success: true,
        message: "All categories fetched successfully",
        category,
    });
});

export const addCategory = asyncHandler(async (req, res) => {
    console.log(req.body);
    
    const { name, slug } = req.body;

    if (!name || !slug) {
        return next(new AppError('Name and slug are required', 400));
    }
    
    const category = new Category({ name, slug });
    await category.save();

    res.status(201).json({
        success: true,
        message: "Category added successfully.",
        category,
    });
});

export const showCategory = asyncHandler(async (req, res) => {
    const { categoryid } = req.params;
    const category = await Category.findById(categoryid);

    if (!category) {
        return next(new AppError('Category not found', 404));
    }
    res.status(200).json({
        success: true,
        category
    });
});

export const updateCategory = asyncHandler(async (req, res) => {
    const { name, slug } = req.body;
    const { categoryid } = req.params;

    const category = await Category.findByIdAndUpdate(
        categoryid,
        { name, slug },
        { new: true }
    );
    if (!category) {
        return next(new AppError('Category not found', 404));
    }
    res.status(200).json({
        success: true,
        message: "Category updated successfully.",
        category,
    });
});

export const deleteCategory = asyncHandler(async (req, res) => {
    const { categoryid } = req.params;

    const category = await Category.findByIdAndDelete(categoryid);

    if (!category) {
        return next(new AppError('Category not found', 404));
    }
    res.status(200).json({
        success: true,
        message: "Category deleted successfully.",
    });
});


