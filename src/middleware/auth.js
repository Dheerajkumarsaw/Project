const jwt = require("jsonwebtoken");
const { blog } = require("../controller/blogController");
const authorModel = require("../model/authorModel");
const blogModel = require("../model/blogModel");


// ===================    Authentication   ====================================
let authentication = async function (req, res, next) {
    try {
        let token = req.headers['x-api-key'];
        if (!token) return res.status(403).send({ status: false, message: "Please Enter your Given Token if not then login first" });
        let decode = jwt.verify(token, "Group-5");
        if (!decode) return res.status(401).send({ status: false, message: "Your are not Authenticate to Enter" })
        next()
    } catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
};

// ===========================    Autherization    =====================================
let authorisation = async function (req, res, next) {
    try {
        let blogId = req.params.blogId
        if (!blogId) return res.status(400).send({ status: false, message: "Please enter id" })
        let token = req.headers["x-api-key"];
        if (!token) return res.status(400).send({ status: false, message: "Please enter your token" })
        let blog = await blogModel.findById(blogId);
        if (!blog) return res.status(400).send({ status: false, message:"No blog Exist With this id"} )
        let autherid = blog.authorId

        let decode = jwt.verify(token, "Group-5");
        if (!decode) return res.status(400).send({ status: false, message: "inavalid token" })
        let logged = decode.userId

        if (logged != autherid) return res.status(401).send({ status: false, message: "You are not Autherizse to make changes" })
        next()
    } catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
};

// =============================   query middleware   ===============================
const md3 = async function (req, res, next) {
    try {
        let userid = req.query.authorId
        let token = req.headers["x-api-key"];

        if (!token) res.status(401).send({ status: false, msg: "token is required" });
        let decodedToken = jwt.verify(token, "Group-5");

        if (!decodedToken)
            return res.status(403).send({ status: false, msg: "token is invalid" });
        // req["x-api-key"] = token;
        let userLoggedIn = decodedToken.userId;

        if (userid != userLoggedIn)
            return res.status(401).send({ status: false, message: "unauthorised user" })
        next();

    } catch (err) {

        res.status(500).send({ status: false, message: err.message })
    }

}

module.exports = { authentication, authorisation, md3 }