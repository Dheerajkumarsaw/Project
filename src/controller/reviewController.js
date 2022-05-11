const reviewModel = require("../model/reviewModel")
const bookModel = require("../model/bookModel")
const { default: mongoose } = require("mongoose")


const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

const createReview = async function (req, res) {
    try {
        // const bookId = req.params.bookId;
        if (!isValidObjectId) {
            return res.status(400).send({ status: false, message: 'Enter BookId First' })
        }
        //    IF  BODY IS EMPTY
        const requestBody = req.body;
        if (Object.keys(requestBody).length == 0) {
            return res.status(400).send({ status: false, message: "Enter review in Body" })
        }
        //    DB CALL FOR BOOK EXISTENCE
        const dbBook = await bookModel.findOne({ _id: bookId, isDeleted: false });
        if (!dbBook) {
            return res.status(404).send({ status: false, message: "Book Not found" })
        }
        const { bookId, reviewedBy, reviewedAt, rating, review } = requestBody

    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}