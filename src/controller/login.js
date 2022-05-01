const jwt = require("jsonwebtoken");
const authorModel = require("../model/authorModel");


// ============================================  Login User  ================================================
let login = async function (req, res) {
    try {
        let data = req.body;
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please enter your email and password" })
        let email = req.body.email;
        let password = req.body.password;

        let regx = /^([a-zA-Z0-9\._]+)@([a-zA-Z0-9]+.)([a-z]+)(.[a-z])?$/;

        if (!email) return res.status(400).send({ status: false, message: "Please entre Your email id" });
        if (!email.trim()) return res.status(400).send({ status: false, message: "Please Enter Your Email" });

        if (!password) return res.status(400).send({ status: false, message: "Please enter Your password" })
        if (!password.trim()) return res.status(400).send({ status: false, message: "Please enter Your password" });

        if (!regx.test(email)) return res.status(400).send({ status: false, message: "Please enter a valid email id" });
        let user = await authorModel.findOne(data);
        if (Object.keys(user).length == 0) return res.status(400).send({ status: false, message: "Please check your email or password" });
        let token = jwt.sign({ userId: user._id.toString(), group: "group-5" }, "Group-5");
        res.setHeader("x-api-key", token)
        res.status(201).send({ status: true, message: "You are Successfully Logined", token: token })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
};

module.exports.login = login