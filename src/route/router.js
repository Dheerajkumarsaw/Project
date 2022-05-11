const express = require("express");

const router = express.Router();
const userController = require("../controller/userController");
const bookController = require("../controller/bookController");
const middleware = require("../middleware/auth");
const reviewController = require("../controller/reviewController")


router.post("/register", userController.createUser);

router.post("/login", userController.loginUser);

router.put("/books/:bookId", bookController.updateBook);

router.delete("/books/:bookId", bookController.deleteBook)





router.post('/books', bookController.createBook)

// router.get('/getBooks', bookController.getBookByFilter)

module.exports = router