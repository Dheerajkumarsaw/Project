const express = require("express")

const router=express.Router();
const controller=require("../controller/controller")






router.get("/get",function(req,res){
    res.send("hello")
})

router.post("/authors",controller.Author)
router.post("/blogs",controller.blog)











module.exports=router;