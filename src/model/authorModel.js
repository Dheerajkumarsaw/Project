const mongoose = require("mongoose")

const authorSchema = new mongoose.Schema({

    fname: { type: String, required: true, trim: true },
    lname: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true, enum: ["Mr", "Mrs", "Miss"] },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 8, maxlength: 20, trim: true }

}, { timestamps: true });


module.exports = mongoose.model("Author", authorSchema)