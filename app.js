const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const {Tag} = require("./model");

const app=express();

app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb+srv://admin:pVzqSUxXFKLATeVw@cluster0.lelomd6.mongodb.net/?retryWrites=true&w=majority",
    { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    }
).then(()=>{
    console.log("connected to db");
});

app.use(async (req, res, next)=>{
    req.tags = await Tag.find({}, {name: 1, _id:0});
    return next();
})
let adminRoutes = require("./adminRoutes");
app.use("/admin", adminRoutes);

let userroutes = require("./userRoutes");
app.use("/", userroutes);

app.listen(process.env.PORT||8080);