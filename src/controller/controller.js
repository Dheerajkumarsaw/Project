const authorModel = require("../model/author")
const blogModel = require("../model/blog")
const moment=require("moment")

let Author = async function (req, res) {
    try {
        let data = req.body
        let fname = req.body.firstName;
        let lname = req.body.lastName;
        let title = req.body.title;
        let mail = req.body.email;
        let pass = req.body.password;
        let regx = /^([a-zA-Z0-9\._]+)@([a-zA-Z0-9]+.)([a-z]+)(.[a-z])?$/
        if (!data) return res.status(400).send("Please Enter Data")
        if (!fname) return res.status(400).send("Please Enter your First Name");
        if (!lname) return res.status(400).send("Please Enter your Last Name");
        if (!title) return res.status(400).send("Please Enter your title");
        if (!mail) return res.status(400).send("Please Enter your Email");
        if (!regx.test(mail)) return res.status(400).send("Please Enter a valid EmailId");
        if (!pass) return res.status(400).send("Please Enter your Password");
        let passcheck = pass.length;
        if (!(passcheck >= 8 && passcheck <= 20)) return res.status(400).send("Please Enter a valid Password");
        let saved = await authorModel.create(data);
        res.status(201).send({ data: saved })
    }
    catch (err) {
        res.status(500).send({ Error: err.message })
    }
};

let blog = async function (req, res) {
    try {
        let data = req.body;
        let title = req.body.title;
        let body = req.body.body;
        let authorid = req.body.authorId;
        let tags = req.body.tags;
        let category = req.body.category;
        let subcategory = req.body.subcategory;
        if (!data) return res.status(400).send("Please Enter Data");
        if (!title) return res.status(400).send("Please Enter title");
        if (!body) return res.status(400).send("Please Details about your Blog");
        if (!tags) return res.status(400).send("Please Enter Your Tags");
        if (!category) return res.status(400).send("Please Enter Your Blog category");
        if (!subcategory) return res.status(400).send("Please Enter Your Blog's subcategory");
        if (!authorid) return res.status(400).send("Please Enter Author id");
        let modelid = await authorModel.findById({ _id: authorid });
        let id = modelid._id;
        if (!(id == authorid)) return res.status(400).send("Please enter a avlid autherId")
        data.publishedAt=Date.now()
        let saved = await blogModel.create(data);
        res.status(201).send({ data: saved });
    }
    catch (err) {
        res.status(500).send({ Error: err.message })
    }
}

module.exports.Author = Author
module.exports.blog = blog;