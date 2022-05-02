const authorModel = require("../model/authorModel")
const blogModel = require("../model/blogModel")
const moment = require("moment");

// ==================================================    Get Blog  ================================================
let getblog = async function (req, res) {
    try {
         let data=req.query
         console.log(data)
         let getData =await blogModel.find( {$and : [data, { isDeleted: false }, { isPublished: true }]})
         console.log( [data, { isDeleted: false }, { isPublished: true }])
        if(!(data))
    getData = await blogModel.find({ isDeleted: false, isPublished: true})
        
        if (getData.length===0)
            return res.status(404).send({ status: false, msg: "Blogs are not present" })
        res.status(200).send({ status: true, msg: getData })
    }
    catch (error) {
        res.status(400).send({ status: false, msg: error.message })
    }
}

// ==========================================  Delete  Blog  ==================================================
let deleted = async function (req, res) {
    try {
        let blogid = req.params.blogId;
        if (!blogid) return res.status(400).send({ status: false, message: "Please enter Blog id" })
        let modelid = await blogModel.find({ _id: blogid, isDeleted: false })
        if (!modelid) return res.status(404).send({ status: false, message: "Record  Not found" });

        let modified = await blogModel.findByIdAndUpdate({ _id: blogid }, { $set: { isDeleted: true, deleteAt: Date.now() } }, { new: true })
        res.status(201).send({ status: true, message: "Your Blog Is Successfully Deleted" })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
};
// ==========================================  Delete  Blog  ===============================================

let deletequery = async function (req, res) {
    try {
        let data = req.query;
        let mydata = []
    
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please enter data" })
        let deletedata = await blogModel.find(data)
        if (!deletedata) return res.status(404).send({ status: false, message: "Such Blog not found" })

        for (let i = 0; i < deletedata.length; i++) {
            mydata[i] = deletedata[i];
        }

        for (let i = 0; i < mydata.length; i++) {
            if (mydata[i].isDeleted != true) {
                mydata[i] = await blogModel.updateMany(mydata[i], { $set: { isDeleted: true } }, { new: true, upsert: true })
            }
        }
        res.status(201).send({ status: true, message: "Blog is successfully deleted" })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
};


module.exports = { getblog, deleted, deletequery }



