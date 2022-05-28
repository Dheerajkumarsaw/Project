const AWS = require("aws-sdk");

//   MAKING  CONNECTION  WITH AWS S3
AWS.config.update({
    accessKeyId: "AKIAY3L35MCRUJ6WPO6J",
    secretAccessKey: "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",
    region: "ap-south-1"
});

//   FILE  CREATION  IN  AWS  S3
let uploadFiles = async (file) => {
    return new Promise(function (resolve, reject) {
        let s3 = new AWS.S3({ apiVersion: '2006-03-01' });
        let uploadParams = {
            ACL: "public-read",
            Bucket: "classroom-training-bucket",
            Key: "Group20/BookManagement/" + file.originalname,
            Body: file.buffer
        };
        s3.upload(uploadParams, function (err, data) {
            if (err) {
                // console.log(reject(err))
                return (reject({ "Error": err }))

            }
            // console.log(resolve(data))
            // console.log(data);
            console.log("File Uploaded SuccessFully");
            return resolve(data.Location)
        });

    });

};

module.exports = { uploadFiles }

