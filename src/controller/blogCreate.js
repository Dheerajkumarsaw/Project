

// const isValid = function(value){
//     if (typeof value=="undefined" || typeof value==null) return false
//     if (typeof value=="string" || typeof value.toString().trim().length==0) return false
//     return true
// }
// ====================================================   Create  Blog  ===============================================================
let blog = async function (req, res) {
    try {
        let data = req.body;
        const {title,body,authorId,tags,category,subcategory}=data
        
        if (Object.keys(data).length == 0) return res.status(400).send("Please Enter Data");
        if (!title) return res.status(400).send("Please enter your Blogs title");
        if (!title.trim()) return res.status(400).send("Please Enter Your Blog Title This is Mandatory");
        
        if (!body) return res.status(400).send("Please Enter Blogs Details");
        if (!body.trim()) return res.status(400).send("Please Write Somthing About Your Blog");

        if (!tags) return res.status(400).send("Please Enter Your Blog  Tags");
        if (!tags.trim()) return res.status(400).send("Please Enter Your Blog Tag This is Mandatory");

        if (!category) return res.status(400).send("Please Enter Your Blog category");
        if (!category.trim()) return res.status(400).send("Please Enter Your Blog Category");

        if (!subcategory) return res.status(400).send("Please Enter Your Blog's subcategory");
        if (!subcategory.trim()) return res.status(400).send("Please Enter Blog Subcategory");

        if (!authorId) return res.status(400).send("Please Enter Author id");
        if (!authorId.trim()) return res.status(400).send("Please Enter your Autherid");

        let modelid = await authorModel.findById({ _id: authorId });
        if (modelid == null) return res.status(400).send("No blog  exist with this author id")
        let id = modelid._id;
        if (!(id == authorId)) return res.status(400).send("Please enter a avlid autherId");

        data.publishedAt = Date.now();

        let createBlog = await blogModel.create(data);
        res.status(201).send({ status:true,message: "Your blog is Successfully crearted",data:createBlog });
    }
    catch (err) {
        res.status(500).send({ Error: err.message })
    }
};

module.exports.blog = blog