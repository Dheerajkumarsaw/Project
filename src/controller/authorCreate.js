
// const isValid=function(value){
//     if (typeof value=="undefined" || typeof value==null) return false
//     if (typeof value== "string" && typeof value.toString().trim().length==0) return false
//     return true
// }

const authorModel = require("../model/authorModel");

// ====================================================   Register Auther   ============================================================
let author = async function (req, res) {
    try {

        const data = req.body
        const {firstName,lastName,title,email,password}=data;
        
        let regx = /^([a-zA-Z0-9\._]+)@([a-zA-Z0-9]+.)([a-z]+)(.[a-z])?$/
        if (Object.keys(data).length == 0) return res.status(400).send("Please Enter Data");

        if (!firstName) return res.status(400).send("Please enter your First Name ")
        if (!firstName.trim()) return res.status(400).send("Please Enter your First Name This is Mandatory");

        if (!lastName) return res.status(400).send("Please Enter Your Last Name")
        if (!lastName.trim()) return res.status(400).send("Please Enter your Last Name This is Mandatory");

        if (!title) return res.status(400).send("Please Enter Your Title")
        if (!title.trim()) return res.status(400).send("Please Enter your Title This is Mandatory");

        if (!email) return res.status(400).send("Please Enter Your Email ")
        if (!email.trim()) return res.status(400).send("Please Enter your Email This is Mandatory");
        const uniqemail=await authorModel.findOne({email:email});
        if (uniqemail) return res.status(400).send({status:false,message:"Email Allready Exist"})
        if (!regx.test(email)) return res.status(400).send("Please Enter a valid EmailId");

        if (!password) return res.status(400).send("Please Enter Your Password")
        if (!password.trim()) return res.status(400).send("Please Enter your Password This is Mandatory");
        let passcheck = password.trim();
        let valid = passcheck.length;
        if (!(valid >= 8 && valid <= 20)) return res.status(400).send("Please Enter a valid Password");

        let authercreated = await authorModel.create(data);
        res.status(201).send({ status:true,message: "You are successfully Register",data:authercreated })
    }
    catch (err) {
        res.status(500).send({ Error: err.message })
    }
};
module.exports.author=author