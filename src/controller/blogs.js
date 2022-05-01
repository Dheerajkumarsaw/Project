const req = require("express/lib/request")
const mongodb=require("mongodb");
const { header } = require("express/lib/request");
const ObjectId = require('mongoose').Types.ObjectId;
const blogModel=require("../model/blog")
const authorModel=require("../model/author")
const moment=require("moment")
const jwt = require("jsonwebtoken");
const updateBlog=async function(req,res){
    try{
    let blogId=req.params.blogId;
    let blogTitle=req.body.title;    
    let blogBody=req.body.body;
    let blogTags=req.body.tags;
    let blogSubcategory=req.body.subcategory;
    //let blogPublishedDate=req.body.date;
     blogPublishedDate=moment();
    if(!blogId) return res.status(400).send({msg:"id is missing"});
    let blog=await blogModel.findById({_id:blogId});
    if(!blog) return res.status(404).send({msg:"no such blog exist with this id"});
    blog.title=blogTitle;
    blog.body=blogBody;
    blog.tags=blogTags;
    blog.subcategory=blogSubcategory;
    
    let updatedData=await blogModel.findOneAndUpdate(
        
        {_id:blogId},
        {title:blogTitle,body:blogBody,$push:{tags:blogTags,subcategory:blogSubcategory},publishedAt:blogPublishedDate,isPublished:true},
        {new:true,upsert:true}
        )
    
    
    res.status(200).send({status:true,data:updatedData})
    }catch(err){
    
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
    
    }