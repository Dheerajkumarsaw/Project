const jwt = require("jsonwebtoken");
const authorModel = require("../model/author");

let Authentication = async function (req, res, next) {
    try {
        let token = req.header['x-api-key'];
        if (!token) return res.status(400).send("Please Enter your Given Token");
        next()
    } catch (err) {
        res.status(500).send(err.message);
    }
};


let Authorisation = async function (req, res, next) {
    try {
        let token = req.header["x-api-key"];
        let data = req.body;
        let user = await authorModel.find(data);
        let userid = user._id;
        // if(!token) return res.status(400).send("Please ")
        let decode = jwt.verify(token, "Group-5");
        let logged = decode.userId
        if (logged != userid) return res.status(400).send("You are not Autherizse to make changes")
        next()
    } catch (err) {
        res.status(500).send(err.message);
    }
}

module.exports.Authentication=Authentication;
module.exports.Authorisation=Authorisation;