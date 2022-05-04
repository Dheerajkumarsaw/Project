const jwt = require("jsonwebtoken");
const authorModel = require("../model/authorModel");

//==============    Check Validations     ==========
const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
};
const isValidTitle = function (title) {
    return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1
};

// ============================   Register Auther   ================================
const authorCreate = async function (req, res) {
    try {
        const requestBody = req.body;
        if (Object.keys(requestBody).length == 0) return res.status(400).send({ status: false, message: "Invalid Request Please Enter Author Details" });

        const { fname, lname, title, email, password } = requestBody; // Object Destructuring

        const regx = /^([a-z0-9\._]+)@([a-z0-9]+.)([a-z]+)(.[a-z])?$/;
        if (!isValid(fname)) return res.status(400).send({ status: false, message: "Please Enter First Name" });

        if (!isValid(lname)) return res.status(400).send({ status: false, message: "Please Enter Last Name" });

        if (!isValid(title)) return res.status(400).send({ status: false, message: "Please Enter Title" });
        if (!isValidTitle(title)) return res.status(400).send({ status: false, message: "Title Should be Mr,Mrs,Miss" });

        //  Email Validations
        if (!isValid(email)) return res.status(400).send({ status: false, message: "Please Enter Email " });
        if (!regx.test(email)) return res.status(400).send({ status: false, message: "Please Enter valid Email" });
        const uniqemail = await authorModel.findOne({ email: email });
        if (uniqemail) return res.status(400).send({ status: false, message: `${email} Allready Exist use Different` })

        // Password validation
        if (!isValid(password)) return res.status(400).send({ status: false, message: "Please Enter Your Password" });
        const valid = password.length;
        if (!(valid >= 8 && valid <= 20)) return res.status(400).send({ status: false, message: "Please Enter valid Password" });

        const authorCreated = await authorModel.create(requestBody);
        res.status(201).send({ status: true, message: "Author successfully Register", data: authorCreated })
    }
    catch (err) {
        res.status(500).send({ status: false, Error: err.message })
    }
};


// ============================================  Login User  ================================================
const login = async function (req, res) {
    try {
        const requestBody = req.body;
        if (Object.keys(requestBody).length == 0) return res.status(400).send({ status: false, message: "Please Enter Email and password" })
        const { email, password } = requestBody //Destructuring
        const regx = /^([a-zA-Z0-9\._]+)@([a-zA-Z0-9]+.)([a-z]+)+(.[a-z])?$/;

        if (!isValid(email)) return res.status(400).send({ status: false, message: "Please Enter Email" });
        if (!regx.test(email)) return res.status(400).send({ status: false, message: "Enter valid Email" });

        if (!isValid(password)) return res.status(400).send({ status: false, message: "Please enter password" });
        const valid = password.length;
        if (!(valid >= 8 && valid <= 20)) return res.status(400).send({ status: false, message: "Please Enter valid Password" });

        const author = await authorModel.findOne(requestBody);
        if (!author) return res.status(401).send({ status: false, message: "UnAutherize Register First" });

        const token = jwt.sign({
            userId: author._id.toString(),
            group: "group-5",
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 10 * 60 * 60
        }, "Group-5");
        res.setHeader("x-api-key", token)
        res.status(200).send({ status: true, message: "Successfully Logined", token: token })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
};

module.exports = { login, authorCreate }