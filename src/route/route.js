const express = require("express")

const router = express.Router();
const authorController = require("../controller/authorContorller")
const blogController = require("../controller/blogController")

const middleware = require("../middleware/auth")


router.post("/authors", authorController.authorCreate);

router.post("/blogs", middleware.authentication, blogController.blogCreate);

router.get("/blogs", middleware.authentication, blogController.getblog);

router.delete("/blogs/:blogId", middleware.authentication, middleware.authorisation,blogController.deleted);

router.delete("/blogs", middleware.authentication, middleware.md3, blogController.deletequery);

router.put("/blogs/:blogId", middleware.authentication, middleware.authorisation, blogController.updateBlog);

router.post("/login", authorController.login);













module.exports = router;