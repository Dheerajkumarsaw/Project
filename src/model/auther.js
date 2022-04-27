// https://github.com/DheeruBhai2000/Project1-Bloging-site.git  
const mongoose=require("mongoose")

let autherSchema = new mongoose.Schema({
    firstName:{type:String,required:true,trim:true},
    lastName:{type:String,required:true,trim:true},
    title:{type:String,required:true,trim:true,enum:["Mr","Mrs","Miss"]},
    email:{type:String,required:true,match: /.+\@.+\..+/,unique:true},
    password:{type:String,required:true,unique:true,minlength:8,maxlength:20}
},{timestamps:true});


module.exports=mongoose.model("Auther",autherSchema)