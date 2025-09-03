// import mongoose from "mongoose";

// const categorySchema = new mongoose.Schema({

//     name: {
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

// })

// const Category = mongoose.model('Category', categorySchema, 'categories')
// export default Category 




import mongoose, { model } from "mongoose";

const categorySchema = new mongoose.Schema({

  name: {
        type: String,
        required: true, 
        unique: true 
    },

  slug: { 
        type: String,
        required: true,
        unique: true 
    }, // for SEO-friendly URLs

  description: {
     type: String
  }

}, { timestamps: true });

const Category = model("Category", categorySchema);
export default Category;
