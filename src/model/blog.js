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
    tags:{type:String,required:true},
    category: {type:String,enum:["technology", "entertainment", "life style", "food", "fashion"]},
    subcategory:{
        type:String,Technology:{type:String,enum:["web development", "mobile development", "AI", "ML" ]},
        Entertainment:{type:String,enum:["Movie","Poems","Story","Comics"]},
        LifeStyle:{type:String,enum:["Standard","Poor","Luxury"]},
        Food:{type:String,enum:["Chiken","Kavab","Mutton","Icecreame","idali","Dhosha"]},
        Fashion:{type:String,enum:["Greek","Indian","American"]}
    },
    isDeleted:{type:Boolean,default:false},
    isPublished:{type:Boolean,default:false}
},{timestamps:true});


module.exports=mongoose.model("Blog",newBlog)