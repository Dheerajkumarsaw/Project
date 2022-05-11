const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const bookModel = require("../model/bookModel")


const authentication = async function (req, res, next) {
    try {
        const token = req.headers["x-api-key"];
        if (!token) {
            return res.status(403).send({ status: false, message: "Token should Be Present" })
        }
        const decode = jwt.verify(token, "indiaisgreate");
        if (!decode) {
            return res.status(401).send({ status: false, message: "You are Unautherize to Enter" })
        }
        req.loggedInUser = decode.userId   //  MAKING IT ACESSECIABLLE ANY WAHERE
        next()
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
};

const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

// const autherizaion = async function (req, res, next) {
//     try {
//         let userId = req.body.userId;
//         // if(!isValidObjectId(userId)){
//         //     return res.status(400).send({status:false,message:"Enter valid UserId"})
//         // }
//         if (!userId) {
//             const bookId = req.params.bookId;
//             if (!isValidObjectId(bookId)) {
//                 return res.status(400).send({ status: false, message: "Enter valid BookId First" })
//             }
//             const book = await bookModel.findById(bookId);
//             if (!book) {
//                 return res.status(404).send({ status: false, message: "Book not found With Given BookId" })
//             }
//             const user_Id = book.userId
//             userId = user_Id  // EXTRACTING USERID FROM DB IF NOT IN BODY
//         }
//         const token = req.headers["x-api-key"];
//         if (!token) {
//             return res.status(401).send({ status: false, message: "Token should be Present" })
//         }
//         const decode = jwt.verify(token, "indiaisgreate");
//         if (!decode) {
//             return res.status(401).send({ status: false, message: "Unautherize to Make changes" })
//         }
//         const logged = decode.userId
//         if (logged != userId) {
//             return res.status(401).send({ status: false, message: "Yuo are Unautherize to Make Changes" })
//         }
//         next()
//     }
//     catch (err) {
//         res.status(500).send({ status: false, message: err.message })
//     }
// }

module.exports = { authentication }