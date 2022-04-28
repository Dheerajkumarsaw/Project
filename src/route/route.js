const express = require("express")

const router=express.Router();
const controller=require("../controller/controller")






router.get("/get",function(req,res){
    res.send("hello")
})

router.post("/authors",controller.Author);
router.post("/blogs",controller.blog);
router.get("/blogs",controller.getblog);
router.delete("/blogs/:blogId",controller.deleted);
router.delete("/blogs",controller.deletequery);
router.put("/blogs/:blogId",controller.updateblog)













module.exports=router;