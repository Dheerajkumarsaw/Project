const reviewModel = require("../model/reviewModel")
const bookModel = require("../model/bookModel")
const validator = require("../validator/validator");

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
        const { rating, review } = requestBody;
        //     BODY DATA VALIDATIONS

        if (!validator.isValid(rating) || !(rating >= 1 && rating <= 5)) {
            return res.status(400).send({ status: false, message: "Enter Rating From 1 to 5" })
        }
        if (!validator.isValid(review)) {
            return res.status(400).send({ status: false, message: "Enter Review" })
        }
        requestBody["bookId"] = bookId
        requestBody["reviewedAt"] = Date.now();
        const createdReview = await reviewModel.create(requestBody);
        const bookreviewCount = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $inc: { reviews: +1 } })
        const b = ({ _id, bookId, reviewedBy, reviewedAt, rating, review } = createdReview)
        b["reviewdata"] = createReview
        res.status(201).send({ status: true, message: "created successfuly", data: b })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
};

//   ============================================== UPDATE  REVIEW  ===================================================

const updateReview = async function (req, res) {
    try {
        const requestBody = req.body
        const bookId = req.params.bookId
        const reviewId = req.params.reviewId

        if (!validator.isValid(bookId) || !validator.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "enter a valid bookid" })
        }
        const bookDetails = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!bookDetails) {
            return res.status(404).send({ status: false, message: "Book not Found With Given id" })
        }

        if (!validator.isValid(reviewId) || !validator.isValidObjectId(reviewId)) {
            return res.status(400).send({ status: false, message: "enter a valid reviewId" })
        }
        const reviewDetails = await reviewModel.findById(reviewId)
        if (!reviewDetails) {
            return res.status(404).send({ status: false, message: "reviewId does not exist" })
        }

        // check params-bookid mathes with reiews bookid
        if (!(reviewDetails.bookId == bookId)) {
            return res.status(400).send({ status: false, message: `Not a review of book with id ${bookId}` })
        }
        if (!(Object.keys(requestBody).length > 0)) {
            return res.status(404).send({
                status: false,
                message: "Invalid request parameters, Provide data to update review"
            })
        }
        const { reviewedBy, rating, review } = requestBody  // DESTURCTURING

        const filter = {}

        if (reviewedBy) {
            if (!isValid(reviewedBy)) {
                return res.status(400).send({ status: false, message: "enter valid data to reviewedby feild" })
            }
            filter['reviewedBy'] = reviewedBy.trim()
        }

        if (rating) {
            if (!(rating >= 1 && rating <= 5)) {
                return res.status(400).send({ status: false, message: "enter a value to rating feild between 1 and 5" })
            }
            filter['rating'] = rating
        }

        if (review) {
            if (!isValid(review)) {
                return res.status(400).send({ status: false, message: "enter valid data to review feild" })
            }
            filter['review'] = review.trim()
        }
        const updatedReview = await reviewModel.findOneAndUpdate({ _id: reviewId }, { $set: filter }, { new: true })
        const reviewData = await reviewModel.find({ bookId: bookId }).select({ bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })

        const { _id, title, excerpt, userId, category, subcategory, isDeleted, reviews, deletedAt, releaseAt, createdAt, updatedAt } = bookDetails

        const data = { _id, title, excerpt, userId, category, subcategory, isDeleted, reviews, deletedAt, releaseAt, createdAt, updatedAt, reviewData }

        // data["reviewData"] = reviewData;

        return res.status(200).send({ status: true, message: "Review details updated successflly", data: data })

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
};

// =======================================================   DELETING  REVIEW  ==============================================================

const deleteReview = async function (req, res) {
    try {
        const bookId = req.params.bookId;
        const reviewId = req.params.reviewId;
        //      DATA  EXISTANCE  IN DB
        const existBook = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!existBook) {
            return res.status(404).send({ status: false, message: "Book Not found With Given Id" })
        }
        const existReview = await reviewModel.findOne({ _id: reviewId, isDeleted: false });
        if (!existReview) {
            return res.status(404).send({ status: false, message: "Review Not Found Use Different Id" });
        }
        const existBookReviews = await reviewModel.findOne({ _id: bookId, isDeleted: false }).select({ reviews: 1 });
        if (!existBookReviews.reviews == 0) {
            return res.status(400).send({ status: false, message: "Book has no review" })
        }
        const deletedReview = await reviewModel.findOneAndUpdate({ _id: reviewId, isDeleted: false }, { $set: { isDeleted: true } }, { new: true });
        const reviewCountInBook = await bookModel.find({ _id: bookId, isDeleted: false }, { $inc: { reviews: -1 } });
        res.status(200).send({ status: true, message: "Review Deleted Successfully" })  // some edit have do here
    }
    catch (res) {
        res.status(500).send({ status: false, message: err.message });
    }
};


module.exports = { createReview, updateReview, deleteReview }