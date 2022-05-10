const mongoose = require("mongoose")
ObjectId = mongoose.Schema.Types.ObjectId
const moment = require("moment")

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true, trim: true },
    excerpt: { type: String, required: true, trim: true },
    userId: { type: ObjectId, required: true, ref: "User" },
    ISBN: { type: String, required: true, unique: true, trim: true },
    category: { type: String, required: true, trim: true },
    subcategory: [{ type: String, require: true }],
    reviews: { type: Number, default: 0 },
    comment: { type: Number },
    deletedAt: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false },
    releasedAt: { type: Date, required: true, type: ("YYYY-MM-DD") },

}, { timestamps: true })