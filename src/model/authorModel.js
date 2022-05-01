

const mongoose = require("mongoose")

let authorSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true, enum: ["Mr", "Mrs", "Miss"] },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8, maxlength: 20 }
}, { timestamps: true });


module.exports = mongoose.model("Author", authorSchema)