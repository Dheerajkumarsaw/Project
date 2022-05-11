const BookModel = require('../model/bookModel');
const UserModel = require('../model/userModel');
const mongoose= require('mongoose')

// -------------validators-----------
const regType01 = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/ //ISBN
const regType02 = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/ //Date
// const regType03 = /^[A-Za-z0-9]{24}$/
const regType04 = /^[A-Za-z, ]{4,}$/ //

const isValid = function (value) {
    if (typeof value === "undefined" || typeof value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    return true
};

const isValidObjectId = function (ObjectId){
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

//------------creation---------------------
const createBook = async function (req, res) {
    try {
        let requestBody = req.body;

        const { title, excerpt, userId, ISBN, category, subcategory, reviews, releasedAt } = requestBody; //destructuring

        if (Object.keys(requestBody).length == 0) {
            return res.status(400).send({ status: false, message: "Please fill all mandatory fields" })
        }
        if (!isValid(title)) {
            return res.status(400).send({ status: false, message: "'title' is mandatory to fill" });
        }
        if (!isValid(excerpt)) {
            return res.status(400).send({ status: false, message: "'excerpt' is mandatory to fill" });
        }
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "userId should be valid mandatory to fill" });
        }
        if (!isValid(ISBN) || !regType01.test(ISBN)) {
            return res.status(400).send({ status: false, message: "Please Enter a Valid ISBN Number, Type-'String' manadatory field" });
        }
        if (!isValid(category)) {
            return res.status(400).send({ status: false, message: "Category is mandatory and should be 'String Type'" });
        }
        if (!isValid(subcategory)|| !regType04.test(subcategory)) {
            return res.status(400).send({ status: false, message: "Subcategory is mandatory and should be 'String inside an Array'" });
        }
        if (!isValid(releasedAt) || !regType02.test(releasedAt)) {
            return res.status(400).send({ status: false, message: "Enter the date in YYYY-MM-DD format, is mandatory field." });
        }
        // -------Data Base Search------------
        let isbnExist = await BookModel.findOne({ISBN: ISBN})
        if (isbnExist){
            return res.status(400).send({status:false, message: "Doublicate ISBN, not Allowed! "})
        }
        let userExist = await UserModel.findOne({_id:userId})
        if(!userExist){
            return res.status(400).send({status:false, message:"user does not exist with this user ID"})
        }
        let titleExist= await BookModel.findOne({title: title})
        if(titleExist){
            return res.status(400).send({status: false, message:"The title name already exists."})
        }

        // -----------------data creation-----------
        const createdBook = await BookModel.create(requestBody)
        res.status(201).send({status: true, message:"Success", data: createdBook})  

    }
    catch (err) {
        return res.status(500).send({ status: false, Error: err.message })
    }

}










module.exports.createBook = createBook