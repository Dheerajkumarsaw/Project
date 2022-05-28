const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const bookModel = require("../model/bookModel")

const authentication = async function (req, res, next) {
    try {
        const token = req.headers["x-api-key"];
        if (!token) {
            return res.status(400).send({ status: false, message: "Token should Be Present" })
        }
        // let decode=jwt.decode(token,"indiaisgreate")
        const decode = jwt.verify(token, "indiaisgreate", function (err, payload) {
            if (err) {
                // console.log(err)
                return res.status(401).send({ status: false, message: "Unautherize To Make Changes", Error: err })
            } else {
                req.loggedInUser = payload.userId;
                next()
            }
        });
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
};


module.exports = { authentication }