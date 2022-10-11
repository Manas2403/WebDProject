const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const { Tag } = require("./model");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));
// app.set("public_html", path.resolve(__dirname, "public"));
app.use("/", express.static(__dirname + "/public"));

mongoose
  .connect(
    "mongodb+srv://admin:pVzqSUxXFKLATeVw@cluster0.lelomd6.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("connected to db");
  });

app.use(async (req, res, next) => {
  req.tags = {};
  tags = await Tag.find({}, { name: 1, _id: 0 });
  req.tags.name = [];
  req.tags.links = [];
  req.tags.length = tags.length;
  for (let i = 0; i < tags.length; i++) {
    req.tags.name.push(tags[i].name);
    req.tags.links.push(tags[i].name.replace(/\s/g, "+"));
  }
  return next();
});
let adminRoutes = require("./adminRoutes");
app.use("/admin", adminRoutes);

let userroutes = require("./userRoutes");
app.use("/", userroutes);

app.listen(process.env.PORT || 8080);
