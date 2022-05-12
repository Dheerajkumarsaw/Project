const express = require("express");

const router = express.Router();
const userController = require("../controller/userController");
const bookController = require("../controller/bookController");
const middleware = require("../middleware/auth");
const reviewController = require("../controller/reviewController")


router.post("/register", userController.createUser);

router.post("/login", userController.loginUser);

router.put("/books/:bookId", middleware.authentication,  bookController.updateBook);

router.delete("/books/:bookId", middleware.authentication, bookController.deleteBook);

router.get("/books", middleware.authentication, bookController.getBook);

router.get("/books/:bookId", middleware.authentication, bookController.getBookByBookId);

// router.post("/books", middleware.authentication, middleware.autherizaion, bookController.createBook)
router.post("/books", bookController.createBook)





router.post('/books', bookController.createBook)


module.exports = router