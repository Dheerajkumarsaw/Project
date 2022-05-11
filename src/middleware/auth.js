const jwt = require("jsonwebtoken")

const authentication = async function (req, res, next) {
    try {
        const token = req.headers
        if (!token) {
            return res.status(400), send({ status: false, message: "Token should Be Present" })
        }
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
};


const autherizaion = async function (req, res, next) {

}

module.exports = { authentication, autherizaion }