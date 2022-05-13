const express = require("express");

const router = express.Router();
const userController = require("../controller/userController");
const bookController = require("../controller/bookController");
const middleware = require("../middleware/auth");
const reviewController = require("../controller/reviewController")

//---------- User APIs -----------
router.post("/register", userController.createUser);

router.post("/login", userController.loginUser);

//---------- Book APIs ------------
router.post("/books", middleware.authentication, bookController.createBook)

router.put("/books/:bookId", middleware.authentication, bookController.updateBook);

router.get("/books", middleware.authentication, bookController.getBook);

router.get("/books/:bookId", middleware.authentication, bookController.getBookByBookId);

router.delete("/books/:bookId", middleware.authentication, bookController.deleteBook);

// -------- Review APIs -----------
router.post("/books/:bookId/review", reviewController.createReview);

router.put("/books/:bookId/review/:reviewId", reviewController.updateReview);

router.delete("/books/:bookId/review/:reviewId", reviewController.deleteReview)


module.exports = router