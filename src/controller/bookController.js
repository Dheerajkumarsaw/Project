const { default: mongoose } = require("mongoose");
const bookModel = require("../model/bookModel");
const userModel = require("../model/userModel")
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


// -------------validators-----------
const regType01 = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/ //ISBN
const regType02 = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/ //Date
// const regType03 = /^[A-Za-z0-9]{24}$/
const regType04 = /^[A-Za-z, ]{4,}$/ //

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
        if (!isValid(ISBN) || !isValidRegxISBN(ISBN)) {
            return res.status(400).send({ status: false, message: "Please Enter a Valid ISBN Number, Type-'String' manadatory field" });
        }
        if (!isValid(category)) {
            return res.status(400).send({ status: false, message: "Category is mandatory and should be 'String Type'" });
        }
        if (!isValid(subcategory) || !regType04.test(subcategory)) {
            return res.status(400).send({ status: false, message: "Subcategory is mandatory and should be 'String inside an Array'" });
        }
        if (!isValid(releasedAt) || !isValidRegxDate(releasedAt)) {
            return res.status(400).send({ status: false, message: "Enter the date in YYYY-MM-DD format, is mandatory field." });
        }
        // --------------Data Base Search------------
        let isbnExist = await bookModel.findOne({ ISBN: ISBN })
        if (isbnExist) {
            return res.status(400).send({ status: false, message: "Doublicate ISBN, not Allowed! " })
        }
        let userExist = await userModel.findOne({ _id: userId })
        if (!userExist) {
            return res.status(400).send({ status: false, message: "user does not exist with this user ID" })
        }
        let titleExist = await bookModel.findOne({ title: title })
        if (titleExist) {
            return res.status(400).send({ status: false, message: "The title name already exists." })
        }

        // -----------------data creation-----------
        const createdBook = await bookModel.create(requestBody)
        res.status(201).send({ status: true, message: "Success", data: createdBook })

    }
    catch (err) {
        return res.status(500).send({ status: false, Error: err.message })
    }

};
//  ==================================  GET  APIs   =================================================
const getBook = async function (req, res) {
    try {
        const queryParams = req.query;
        const filter = { isDeleted: false }
        //  IF QUERY IS EMPTY
        if (Object.keys(queryParams).length > 0) {
            const { userId, category, subcategory } = queryParams;      //DESTRUCTURING 
            //  QUERY VALIDATIONS
            if (isValid(userId) && (ObjectId.isValid(userId))) {
                filter['userId'] = userId
            }
            if (isValid(category)) {
                filter['category'] = category
            }
            if (isValid(subcategory)) {
                const subArray = subcategory.trim().split(",").map(value => value.trim());
                filter['subcategory'] = { $all: subArray }
            }
        }  // END VALIDATION
        const books = await bookModel.find(filter).select({ title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: 1 });
        if (books.length === 0) {
            return res.status(404).send({ status: false, message: "Books not found" });
        }
        res.status(200).send({ status: true, message: "Books list", data: books });
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};

//     =======================  GET BY BOOKID  ==========================================

const getBookByBookId = async function (req, res) {
    try {
        const bookId = req.params.bookId;
        // validation
        if (bookId) {
            if (!isValidObjectId(bookId)) {
                return res.status(400).send({ status: false, message: "userId is Invalid" });
            }
        }
        //  fetch book with bookId
        const book = await bookModel.findOne({ $and: [{ bookId }, { isDeleted: false }] })
        // no book found
        if (!book) {
            return res.status(404).send({ status: false, mseesge: "book not found" })
        }
        // fetch review in book 
        const review = await reviewModel.find({ bookId: bookId, isDeleted: false });
        const { _id, title, excerpt, userId, category, subcategory, isDeleted, reviews, deletedAt, releaseAt, createdAt, updatedAt } = book

        const data = { _id, title, excerpt, userId, category, subcategory, isDeleted, reviews, deletedAt, releaseAt, createdAt, updatedAt }
        data["reviewData"] = review;
        // SENDIN BOOK LIST 
        res.status(200).send({ status: true, msg: "Book list", data: data });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};

module.exports = { createBook, updateBook, deleteBook, getBook, getBookByBookId }

