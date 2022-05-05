const { default: mongoose } = require("mongoose");
const authorModel = require("../model/authorModel");
const blogModel = require("../model/blogModel");
const moment = require("moment");

const isValid = function (value) {
    if (typeof value === "undefined" || typeof value === null) return false
    if (typeof value == 'string' && value.trim().length === 0) return false
    return true;
};
const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}
// ====================================================   Create  Blog  ===============================================================
const blogCreate = async function (req, res) {
    try {
        const requestBody = req.body;
        if (Object.keys(requestBody).length == 0) return res.status(400).send({ status: false, message: "Please Enter Data" });

        const { title, body, authorId, tags, category, subcategory, isPublished } = requestBody; // Destructuring
        // validations
        if (!isValid(title)) return res.status(400).send({ status: false, message: "Please Enter Blogs title" });
        if (!isValid(body)) return res.status(400).send({ status: false, message: "Enter Blogs Details" });
        if (!isValid(authorId)) return res.status(400).send({ status: false, message: "Please Enter AuthorId" });
        if (!isValidObjectId(authorId)) return res.status(400).send({ status: false, message: `${authorId} is Not Valid AuthorId` });
        if (!isValid(tags)) return res.status(400).send({ status: false, message: "Enter Your Blog  Tags" });
        if (!isValid(category)) return res.status(400).send({ status: false, message: "Enter Blog category" });
        if (!isValid(subcategory)) return res.status(400).send({ status: false, message: "Enter Blog's subcategory" });

        const blogData = {
            title, body, authorId, category,
            isPublished: isPublished ? isPublished : false,
            publishedAt: isPublished ? new Date() : null
        }
        if (tags) {
            if (Array.isArray(tags)) {
                blogData['tags'] = [...tags]
            }
            if (Object.prototype.toString.call(tags) === "[object String]") {
                blogData['tags'] = [tags]
            }
        };
        if (subcategory) {
            if (Array.isArray(subcategory)) {
                blogData['subcategory'] = [...subcategory]
            }
            if (Object.prototype.toString.call(tags) === "[object String]") {
                blogData['subcategory'] = [subcategory]
            }
        }

        const author = await authorModel.findById(authorId);
        if (!author) return res.status(404).send({ status: false, message: `No auther exist with ${authorId} id Please register first` })

        const createBlog = await blogModel.create(blogData);
        res.status(201).send({ status: true, message: "Blog is Successfully crearted", data: createBlog });
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
};
// ===========================    update blog    =============================


const updateBlog = async function (req, res) {
    try {
        const blogId = req.params.blogId;
        if (!blogId) return res.status(400).send({ status: false, message: "id is missing" });
        const requestBody = req.body;
        if (Object.keys(requestBody).length == 0) return res.status(400).send({ status: false, message: "Please Enter Filter as you want" })
        const { title, body, tags, category, subcategory } = requestBody;
        // validations
        if (!isValid(title)) return res.status(400).send({ status: false, message: "Enter title" })
        if (!isValid(body)) return res.status(400).send({ status: false, message: "Enter body" })
        if (!isValid(tags)) return res.status(400).send({ status: false, message: "Enter tags" })
        if (!isValid(category)) return res.status(400).send({ status: false, message: "Enter category" })
        if (!isValid(subcategory)) return res.status(400).send({ status: false, message: "Enter subcategory" })

        let blog = await blogModel.findById({ _id: blogId });
        if (!blog) return res.status(404).send({ status: false, message: "no such blog exist with this id" });
        let isData = await blogModel.findOne({ _id: blogId, isDeleted: false, isPublished: false });
        if (!isData) return res.status(400).send({ status: false, message: "Allready Updated" })

        let updatedData = await blogModel.findOneAndUpdate(
            { _id: blogId, isDeleted: false, isPublished: false },
            { title: title, body: body, category: category, $push: { tags: tags, subcategory: subcategory }, publishedAt: Date.now(), isPublished: true },
            { new: true }
        )

        res.status(200).send({ status: true, message: "Data update successsfully", data: updatedData })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }

};

// ==================================================    Get Blog  ================================================
let getblog = async function (req, res) {
    try {
        const queryParams = req.query;
        const getData = await blogModel.find({ $and: [queryParams, { isDeleted: false }, { isPublished: true }] })
        if (!(queryParams))
            getData = await blogModel.find({ isDeleted: false, isPublished: true })
        if (getData.length === 0)
            return res.status(404).send({ status: false, msg: "Blogs are not present" })
        res.status(200).send({ status: true, data: getData })
    }
    catch (error) {
        res.status(400).send({ status: false, msg: error.message })
    }
}

// ==========================================  Delete  Blog  ==================================================
let deleted = async function (req, res) {
    try {
        const blogid = req.params.blogId;
        if (!blogid) return res.status(400).send({ status: false, message: "Please enter Blog id" });
        // validations
        if (!isValidObjectId(blogid)) return res.status(400).send({ status: false, message: `${blogid} is not valid id` });
        let blog = await blogModel.find({ _id: blogid, isDeleted: false })
        if (!blog) return res.status(404).send({ status: false, message: "Record  Not found" });

        let modified = await blogModel.findByIdAndUpdate({ _id: blogid, isDeleted: false }, { $set: { isDeleted: true, deleteAt: Date.now() } }, { new: true })
        res.status(200).send({ status: true, message: "Your Blog Is Successfully Deleted" })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
};
// ==========================================  Delete  Blog  ===============================================

let deletequery = async function (req, res) {
    try {
        let data = req.query;
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please enter data" })
        const { authorId, category, tags, subcategory, isPublished } = data; // Destructuring
        // validations
        if (!isValid(authorId)) return res.status(400).send({ status: false, message: "Not valid Author id" });
        if (!isValidObjectId(authorId)) return res.status(400).send({ status: false, message: "Not valid Author id" })
        if (!isValid(category)) return res.status(400).send({ status: false, message: "Enter Blog category" });
        if (!isValid(tags)) return res.status(400).send({ status: false, message: "Enter Blog tags" });
        if (!isValid(subcategory)) return res.status(400).send({ status: false, message: "Enter Blog subcategory" });

        const filter = { data, isPublished: false }
        deletedata = await blogModel.find(filter)
        if (!deletedata) return res.status(404).send({ status: false, message: "Such Blog not found" })

        const update = await blogModel.updateMany(filter, { $set: { isDeleted: true, deleteAt: new Date() } }, { new: true })

        res.status(200).send({ status: true, message: "Blog is successfully deleted" })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
};

module.exports = { getblog, deleted, deletequery, updateBlog, blogCreate }