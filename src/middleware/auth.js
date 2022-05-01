const jwt = require("jsonwebtoken");
const { blog } = require("../controller/blogCreate");
const authorModel = require("../model/authorModel");
const blogModel = require("../model/blogModel");
let authentication = async function (req, res, next) {
    try {
        let token = req.headers['x-api-key'];
        console.log(token)
        if (!token) return res.status(400).send("Please Enter your Given Token if not then login first");
        let decode = jwt.verify(token, "Group-5");
        if (!decode) return res.status(400).send("Your are Authenticate to Enter")
        next()
    } catch (err) {
        res.status(500).send(err.message);
    }
};
// try {
//     const data = req.query
//     // if (Object.keys(data) == 0) return res.status(400).send({ status: false, msg: "No input provided" })

//     const blogs = await BlogModel.find({$and : [data, { isDeleted: false }, { isPublished: true }]}).populate("authorId")
//     if (blogs.length == 0) return res.status(404).send({ status: false, msg: "No blogs Available." })
//     return res.status(200).send({ status: true,count:blogs.length, data: blogs });



let authorisation = async function (req, res, next) {
    try {
        let blogId = req.params.blogId
        if (!blogId) return res.status(400).send("Please enter id")
        let token = req.headers["x-api-key"];
        if (!token) return res.status(400).send({ status: false, message: "Please enter your token" })
        let blog = await blogModel.findById(blogId);
    
        let autherid = blog.authorId
    
        let decode = jwt.verify(token, "Group-5");
        if (!decode) return res.status(400).send("inavalid token")
        let logged = decode.userId

        if (logged != autherid) return res.status(400).send("You are not Autherizse to make changes")
        next()
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const md3=async function(req,res,next){
    try{
  let userid=req.query.authorId
  let token=req.headers["x-api-key"];
  
  if(!token) res.status(401).send({status:false,msg:"token is required"});
          let decodedToken = jwt.verify(token, "functionup-thorium");
          
         if (!decodedToken)
           return res.status(401).send({ status: false, msg: "token is invalid" });
           req["x-api-key"]=token;
         let userLoggedIn=decodedToken.userId;
        
         if(userid!=userLoggedIn)
         return res.status(403).send({msg:"unauthorised user"})
         next();
    }catch(err){
  
            console.log("This is the error :", err.message)
            res.status(500).send({ msg: "Error", error: err.message })
    }
  
  }

module.exports = { authentication, authorisation,md3 }