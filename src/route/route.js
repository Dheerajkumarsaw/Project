const express = require("express")

const router = express.Router();
const controller = require("../controller/controller");
const authorController = require("../controller/authorCreate")
const blogController = require("../controller/blogCreate")
const loginController = require("../controller/login")
const middleware = require("../middleware/auth")




router.post("/authors", authorController.author);
router.post("/blogs", middleware.authentication, blogController.blog);
router.get("/blogs", middleware.authentication, controller.getblog);
router.delete("/blogs/:blogId", middleware.authentication, middleware.authorisation, controller.deleted);
router.delete("/blogs", middleware.authentication, middleware.authorisation, controller.deletequery);
router.put("/blogs/:blogId", middleware.authentication, middleware.authorisation, controller.updateblog);
router.post("/login", loginController.login)













module.exports = router;