const mongoose = require("mongoose")
const Object_id = mongoose.Types.ObjectId
const newBlog = new mongoose.Schema({

    title: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    authorId: {
        type: Object_id,
        required: true,
        ref: "Auther"
    },
    tags: [{ type: String, required: true, trim: true }],
    category: { type: String, required: true, trim: true },
    subcategory: [{ type: String, required: true, trim: true }],
    deleteAt: { type: Date, default: null },
    publishedAt: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false }
    
}, { timestamps: true });


module.exports = mongoose.model("Blog", newBlog)