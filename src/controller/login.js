const jwt = require("jsonwebtoken");
const authorModel = require("../model/authorModel");


// ============================================  Login User  ================================================
let login = async function (req, res) {
    try {
        let data = req.body;
        if (Object.keys(data).length == 0) return res.status(400).send("Please enter your email and password")
        let mail = req.body.email;
        let pass = req.body.password;
        let regx = /^([a-zA-Z0-9\._]+)@([a-zA-Z0-9]+.)([a-z]+)(.[a-z])?$/;
        if (!mail) return res.status(400).send("Please entre Your email id");
        if (!pass) return res.status(400).send("Please enter Your password");
        if (!regx.test(mail)) return res.status(400).send("Please enter a valid email id");
        let user = await authorModel.findOne(data);
        if (Object.keys(user).length == 0) return res.status(400).send("Please check your email or password");
        let token = jwt.sign({ userId: user._id.toString(), group: "group-5" }, "Group-5");
        res.setHeader("x-api-key", token)
        res.status(201).send({ status: true, message: "You are Successfully Logined", token: token })

    } catch (err) {
        res.status(500).send(err.message)
    }
};

module.exports.login = login