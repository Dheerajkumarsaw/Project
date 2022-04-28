const express = require("express")

const router = express.Router();
const controller = require("../controller/controller");
const middleware = require("../middleware/auth")






router.get("/get", function (req, res) {
    res.send("hello")
})

router.post("/authors", controller.Author);
router.post("/blogs", middleware.Authentication, middleware.Authorisation, controller.blog);
router.get("/blogs", middleware.Authentication, middleware.Authorisation, controller.getblog);
router.delete("/blogs/:blogId", middleware.Authentication, middleware.Authorisation, controller.deleted);
router.delete("/blogs", middleware.Authentication, middleware.Authorisation, controller.deletequery);
router.put("/blogs/:blogId", middleware.Authentication, middleware.Authorisation, controller.updateblog);
router.post("/login", controller.login)













module.exports = router;