const userModel = require("../model/userModel");
const jwt = require("jsonwebtoken");

const isValid = function (value) {
    if (typeof value === "undefined" || typeof value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    return true
};

const isValidTitle = function (title) {
    return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1
}
// ============================== User creation =================================
const createUser = async function (req, res) {
    try {
        const requestBody = req.body;
        //IF DATA NOT COME IN BODY
        if (Object.keys(requestBody).length == 0) {
            return res.status(400).send({ status: true, message: "Enter Data in body" });
        }
        const { title, name, phone, email, password, address } = requestBody; //DESTRUCTURING

        // DATA COMING VALIDATIONS
        if (!isValid(title)) {
            return res.status(400).send({ status: false, message: "Enter title first" });
        }
        if (!isValidTitle(title)) {
            return res.status(400).send({ status: false, message: "Enter any one MR,Mrs,Miss" });
        }
        if (!isValid(name)) {
            return res.status(400).send({ status: false, message: "Enter Name first" });
        }
        // MOBILE VALIDATION
        if (!isValid(phone)) {
            return res.status(400).send({ status: false, message: "Enter Mobile No first" });
        }
        const mobileRegx = /^[6-9]\d{9}$/;
        if (!mobileRegx.test(phone)) {
            return res.status(400).send({ status: false, message: "Enter valid mobile no" });
        }
        //EMAIL VALIDATION
        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: "Enter Email first" });
        }
        const emailRegx = /^([a-z0-9]+@[a-z]+\.[a-z]{2,3})?$/
        if (!emailRegx.test(email)) {
            return res.status(400).send({ status: false, message: "Enter Valid Email" });
        }
        // PASSWORD VALIDATIONS
        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: "Enter Password first" });
        }
        if (!(password.length >= 8 && password.length <= 15)) {
            return res.status(400).send({ status: false, message: "Enter valid password" });
        }
        // ADDRESS VALIDATIONS 
        if (!isValid(address)) {
            return res.status(400).send({ status: false, message: "Enter Address first" });
        }
        if (!isValid(address.street)) {
            return res.status(400).send({ status: false, message: "Enter Street first" });
        }
        if (!isValid(address.city)) {
            return res.status(400).send({ status: false, message: "Enter City first" });
        }
        if (!isValid(address.pincode)) {
            return res.status(400).send({ status: false, message: "Enter Pincode first" });
        }
        if (Object.keys(address.pincode).length !== 6) {
            return res.status(400).send({ status: false, message: "Enter valid Pincode" });
        }
        // DUPLICAY VALIDATION
        const uniqueEmail = await userModel.findOne({ email: email });
        if (uniqueEmail) {
            return res.status(400).send({ status: false, message: "User Allready Email Exist" });
        }
        const uniquePhone = await userModel.findOne({ phone: phone });
        if (uniquePhone) {
            return res.status(400).send({ status: false, message: "User Allready phone Exist" });
        }
        // DATA CREATION
        const createdUser = await userModel.create(requestBody);
        res.status(201).send({ status: true, message: "Successfully data created", data: createdUser });
    }
    catch (err) {
        res.status(500).send({ status: false, Error: err.message })
    }
};

const loginUser = async function (req, res) {
    try {
        const requestBody = req.body;
        // IF DATA NOT COMING
        if (Object.keys(requestBody).length == 0) {
            return res.status(400).send({ status: false, message: "Enter Login details" });
        }
        const { email, password } = requestBody; // DESTRUCTURING

        //  Email Validations
        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: "Enter Email First" })
        }
        const emailRegx = /^([a-z0-9]+@[a-z]+\.[a-z]{2,3})?$/
        if (!emailRegx.test(email)) {
            return res.status(400).send({ status: false, message: "Enter valid email" });
        }
        // password validations
        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: "Enter password first" });
        }
        if (!(password.length >= 8 && password.length <= 15)) {
            return res.status(400).send({ status: false, message: "Enter valid Password" });
        }
        //  DB VALIDATIONS 
        const existUser = await userModel.findOne(requestBody)
        if (!existUser) {
            return res.status(401).send({ status: false, message: "Unautherise Register first" });
        }
        //  TOKEN CREATION
        const token = jwt.sign({
            userId: existUser._id,
            group: "group-1",
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 10 * 60 * 60
        }, "indiaisgreate");
        //TOKEN SENDING
        res.setHeader("x-api-key", token)
        res.status(200).send({ status: true, message: "Logined successfully", Token: token })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { createUser, loginUser }
