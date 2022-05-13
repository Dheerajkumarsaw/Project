const reviewModel = require("../model/reviewModel")
const bookModel = require("../model/bookModel")
const { default: mongoose, isValidObjectId } = require("mongoose")
const validator = require("../validator/validator")

// ============================================   REVIEW  CREATION ====================================================

const createReview = async function (req, res) {
    try {
        const bookId = req.params.bookId;
        if (!validator.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: 'Enter BookId First Also Valid' })
        }
        //    IF  BODY IS EMPTY
        const requestBody = req.body;
        if (Object.keys(requestBody).length == 0) {
            return res.status(400).send({ status: false, message: "Enter review Details in Body" })
        }
        //    DB CALL FOR BOOK EXISTENCE
        const dbBook = await bookModel.findOne({ _id: bookId, isDeleted: false });
        if (!dbBook) {
            return res.status(404).send({ status: false, message: "Book Not found" })
        }
        const { reviewedBy, reviewedAt, rating, review } = requestBody;
        //     BODY DATA VALIDATIONS
        if(!validator.isValid(reviewedAt)){
            return res.status(400).send({status:false,message:""})
        }

    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}