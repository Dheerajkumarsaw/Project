const mongoose = require("mongoose")
const Object_id = mongoose.Types.ObjectId
let newBlog = new mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    autherId: {
        type: Object_id,
        required: true,
        ref: "Auther"
    },
    tags:[{type:String,required:true}],
    category: {type:String,required:true},
    subcategory:[{type:String,required:true}],
    deletAt:{type:Date},
    publishedAt:{type:Date},
    isDeleted:{type:Boolean,default:false},
    isPublished:{type:Boolean,default:false}
},{timestamps:true});


module.exports=mongoose.model("Blog",newBlog)