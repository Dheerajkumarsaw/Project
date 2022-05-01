
const blogModel = require("../model/blogModel")

const moment = require("moment")


const updateBlog = async function (req, res) {
    try {
        let blogId = req.params.blogId;
    
        let blogTitle = req.body.title;
        let blogBody = req.body.body;
        let blogTags = req.body.tags;
        let blogSubcategory = req.body.subcategory;
        blogPublishedDate = moment();
        if (!blogId) return res.status(400).send({ status: false, message: "id is missing" });
        let blog = await blogModel.findById({ _id: blogId });
        if (!blog) return res.status(404).send({ status: false, message: "no such blog exist with this id" });
        blog.title = blogTitle;
        blog.body = blogBody;
        blog.tags = blogTags;
        blog.subcategory = blogSubcategory;

        let updatedData = await blogModel.findOneAndUpdate(

            { _id: blogId },
            { title: blogTitle, body: blogBody, $push: { tags: blogTags, subcategory: blogSubcategory }, publishedAt: blogPublishedDate, isPublished: true },
            { new: true, upsert: true }
        )

        res.status(200).send({ status: true, data: updatedData })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }

};
module.exports.updateBlog = updateBlog