const jwt = require("jsonwebtoken");
const authorModel = require("../model/authorModel");
const blogModel = require("../model/blogModel");
let authentication = async function (req, res, next) {
    try {
        // let token = req.header['x-api-key'];
        // if (!token) return res.status(400).send("Please Enter your Given Token if not then login first");
        // let decode = jwt.verify(token, "Group-5");
        // if (!decode) return res.status(400).send("Your are Authenticate to Enter")
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
        // let token = req.header["x-api-key"];
        // let data = req.query;
        // let blog = await blogModel.find(data)
        // let blogid = req.params.blogId
        // if (!blogid) {
        //     blogid = req.query.blogId
        // }
        // bolg = await blogModel.findById(blogid);
        // let autherid = bolg.autherId
        // // let user = await authorModel.find(data);
        // // let userid = user._id;
        // // if(!token) return res.status(400).send("Please ")
        // let decode = jwt.verify(token, "Group-5");
        // let logged = decode.userId
        // if (logged != autherid) return res.status(400).send("You are not Autherizse to make changes")
        next()
    } catch (err) {
        res.status(500).send(err.message);
    }
}

module.exports = { authentication, authorisation }