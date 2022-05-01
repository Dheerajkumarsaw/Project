const authorModel = require("../model/authorModel")
const blogModel = require("../model/blogModel")
const moment = require("moment");

// ==================================================    Get Blog  ================================================
let getblog = async function (req, res) {
    try {
        let data = req.query;
        let filter = await blogModel.find({ $and: [data, { isDeleted: false, isPublished: true }] })
        if (!data) return res.status(400).send("Please Enter Your Filter")
        filter = await blogModel.find({ isDeleted: false, isPublished: true });
        if (filter.length == 0) return res.status(404).send({ Error: "Record Not found" })
        res.status(200).send({ status: true, data: filter })
    }
    catch (err) {
        res.status(500).send(err.message)
    }
};
// ==========================================================   Update  Blog  ========================================
let updateblog = async function (req, res) {
        try {
            let blogid = req.params.blogId;
            if (!blogid) return res.status(400).send("Please enter your id");
            if (!isValidObjectId(blogid))
                return res.status(400).send({ status: false, msg: "please provide a valid object id" })
            let blog = await blogModel.findOne({ _id: blogid, isDeleted: false });
            if (!blog) return res.status(400).send("No Such blog exist");
            let a = req.body.title
            let b = req.body.category
            let c = req.body.body
            let d = true
            let e = Date.now()
            let f = req.body.subcategory
            let g = req.body.tags
            if (blog.isPublished == true) {
                let updated = await blogModel.findOneAndUpdate({ _id: blogid }, { title: a, category: b, body: c, $push: { subcategory: f, tags: g } }, { new: true })
                res.status(200).send({ status: true, data: updated })
            }
            else {
                let update = await blogModel.findByIdAndUpdate({ _id: blogid }, { title: a, category: b, body: c, isPublished: d, publishedAt: e, $push: { subcategory: f, tags: g } }, { new: true })
                res.status(200).send({ status: true, data: update })
            }

        }

        catch (err) {
            res.status(500).send(err.message)
        }
    }
    // ==========================================  Delete  Blog  ==================================================
    let deleted = async function (req, res) {
        try {
            let blogid = req.params.blogId;
            if (!blogid) return res.status(400).send("Please enter Blog id")
            let modelid = await blogModel.find({ _id: blogid, isDeleted: false })
            if (!modelid) return res.status(404).send("Record  Not found");
            if (len == 0) return res.status(400).send("Blog not found")
            if (del == true) return res.status(400).send("Blog is already deleted")
            let modified = await blogModel.findByIdAndUpdate({ _id: blogid }, { $set: { isDeleted: true, deleteAt: Date.now() } }, { new: true })
            res.status(201).send({ status: true, message: "Your Blog Is Successfully Deleted" })
        } catch (err) {
            res.status(500).send(err.message)
        }
    };
    // ==========================================  Delete  Blog  ===============================================

    let deletequery = async function (req, res) {
        try {
            let data = req.query;
            let mydata=[]
            let update;
            if (Object.keys(data).length = 0) return res.status(400).send("Please enter data")
            let deletedata = await blogModel.find(data)
            for(let i=0;i<deletedata.length;i++)
            {
                    mydata[i]=deletedata[i];
            }
           
            if (!deletedata) return res.status(404).send("Such Blog not found")
            //let del = deletedata.isDeleted;
    
            if (deletedata.isDeleted) return res.status(400).send("Blog is Allready deleted")
            for(let i=0;i<mydata.length;i++)
            {
                if(mydata[i].isDeleted!=true){
             mydata[i]=await blogModel.updateMany(mydata[i],{$set:{isDeleted:true}},{new:true,upsert:true})
            }
            console.log(mydata[i]);
            }
            res.status(201).send(mydata)
        }
        catch (err) {
            res.status(500).send(err.message)
        }
    };
    



    // let deletequery = async function (req, res) {
    //     try {
    //         let data = req.query;
    //         let filter = { data, isDeleted: false, }
    //         if (Object.keys(data).length == 0) return res.status(400).send("Please enter data")
    //         let deletedata = await blogModel.find(filter,)
    //         if (!deletedata) return res.status(404).send("Such Blog not found");
    //         let update = await blogModel.find(filter, { $set: { isDeleted: true } }, { new: true })
    //         res.status(201).send("your update is Successfully done")
    //     }
    //     catch (err) {
    //         res.status(500).send(err.message)
    //     }
    // };

    module.exports = { updateblog, getblog, deleted, deletequery }




// ===========================boubt code=====================
// try {
//     let blogid = req.params.blogId;
//     let data = req.body;
//     // let publishedAt = req.body.date;
//     if (!blogid) return res.status(400).send("Please enter your Blog id");
//     let find = await blogModel.find({ _id: blogid, isDeleted: false });
//     if (!find) return res.status(404).send("Record Not Found");
//     find = await blogModel.find({ _id: blogid, isDeleted: false }, { $set: {} })
//     // if (!publishedAt) publishedAt = Date.now();
//     // let blog = await blogModel.findById(blogid);
//     // if (!blog) return res.status(400).send("No Such blog exist");
//     // let update = await blogModel.findByIdAndUpdate({ _id: blogid }, { $set: { data, publishedAt: publishedAt } }, { new: true });
//     // res.status(200).send({ data: update })
// }