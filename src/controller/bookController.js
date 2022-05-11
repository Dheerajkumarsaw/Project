const { default: mongoose } = require("mongoose");
const bookModel = require("../model/bookModel");

const isValid = function (value) {
    if (typeof value === "undefined" || typeof value === null) return false
    if (typeof value == "string" && value.trim().length === 0) return false
    return true
};

const isValidRegxDate = function (value) {
    const regx = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/
    return regx.test(value)
}
const isValidRegxISBN = function (value) {
    const regx = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/;
    return regx.test(value)
};
const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
};

// ================================================  UPDATING BOOK   =======================

const updateBook = async function (req, res) {
    try {
        const bookId = req.params.bookId;
        //BOOKID VALIDATIONS
        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "Enter BookId in Params also Valid Id" })
        }
        //  DOCUMENT EXIST OR NOT IN DB
        const dbbook = await bookModel.findOne({ bookId: bookId, isDeleted: false });
        if (!dbbook) {
            return res.status(404).send({ status: false, message: "Book not found With Given id" })
        }
        const requestBody = req.body
        //  IF BODY IS EMPTY
        if (Object.keys(requestBody).length == 0) {
            return res.status(400).send({ status: false, message: "Enter Data in Body" })
        }
        const { title, excerpt, releasedAt, ISBN } = requestBody; // DESTRUCTURING
        // BODY DATA VALIDATIONS
        if (!isValid(title)) {
            return res.status(400).send({ status: false, message: "Eneter Title" });
        }
        if (!isValid(excerpt)) {
            return res.status(400).send({ status: false, message: "Enter excerpt" });
        }
        //   DATE VALIDATION
        if (!isValid(releasedAt)) {
            return res.status(400).send({ status: false, message: "Enter release date" });
        }
        if (!isValidRegxDate(releasedAt)) {
            return res.status(400).send({ status: false, message: "Enter date in YYYY-MM-DD formate" })
        }
        //  ISBN NO VALIDATION
        if (!isValid(ISBN)) {
            return res.status(400).send({ status: false, message: "Enter ISBN" });
        }
        if (!isValidRegxISBN(ISBN)) {
            return res.status(400).send({ status: false, message: "Enter valid ISBN no" })
        }
        // CHECKING UNIQUE EXISTANCE IN DB
        const uniqueIsbn = await bookModel.findOne({ ISBN: ISBN });
        if (uniqueIsbn) {
            return res.status(400).send({ status: false, message: "ISBN Allready Exist Use Different" })
        }
        const uniqueTitle = await bookModel.findOne({ title: title });
        if (uniqueTitle) {
            return res.status(400).send({ status: false, message: "Title Allready Exist Use different Title" })
        }
        //  UPADATING DOCUMENT IN DB
        const updatedBook = await bookModel.findByIdAndUpdate({ _id: bookId }, { $set: { title: title, excerpt: excerpt, releasedAt: releasedAt, ISBN: ISBN } }, { new: true });
        res.status(200).send({ status: true, message: "Updated Successfully", data: updatedBook })

    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
};
// ====================================================  DELETING BOOK  =========================================
const deleteBook = async function (req, res) {
    try {
        const bookId = req.params.bookId;
        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "Enter BookId in Params also Valid Id" })
        }
        const existBook = await bookModel.findOne({ _id: bookId, isDeleted: false });
        if (!existBook) {
            return res.status(404).send({ status: false, message: "Book not Found With given id" });
        }
        deletedAt = Date.now();
        const updatedBook = await bookModel.findOneAndUpdate({ _id: bookId }, { $set: { isDeleted: true, deletedAt: deletedAt } }, { new: true });
        res.status(200).send({ status: true, message: "Successfully Deleted", data: updatedBook })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { createBook, updateBook, deleteBook, getBook }