const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const bookSchema = new mongoose.Schema({
    title: {
        type: String, lowercase: true,
        required: true, unique: true, trim: true
    },
    excerpt: {
        type: String,
        required: true, trim: true
    },
    userId: {
        type: ObjectId,
        required: true, ref: "User"
    },
    ISBN: {
        type: String,
        required: true, unique: true, trim: true
    },
    category: {
        type: String,
        required: true, trim: true
    },
    subcategory: [{
        type: String,
        require: true,
        trim: true
    }],
    reviews: {
        type: Number,
        default: 0
    },
    bookCover: { type: String, required: true },
    deletedAt: {
        type: Date,
    },
    isDeleted: { type: Boolean, default: false },
    releasedAt: { type: Date, required: true, trim: true }

}, { timestamps: true });

module.exports = mongoose.model("Book", bookSchema)