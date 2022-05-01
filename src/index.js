const express = require("express")

var bodyParser = require("body-parser")

const route = require("./route/route.js");
const { default: mongoose } = require("mongoose");
const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://dheerubhai2000:gqG*2JVkTEt5T*G@cluster0.hk6qb.mongodb.net/project1-Blog-DB", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDB is connected"))
    .catch(err => console.log(err))



app.use("/", route);
app.listen(process.env.PORT || 3000, function () {
    console.log("Express app running on port " + (process.env.PORT || 3000))
});