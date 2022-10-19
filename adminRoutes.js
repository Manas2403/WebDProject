const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {Post, Tag} = require("./model");

module.exports = router;

router.use((req, res, next)=>{
    req.user = false;
    if(req.cookies.secret){
        jwt.verify(req.cookies.secret, "rf01Amaio2974bnxc77fa93h3hbnc93280a", (err, data)=>{
            if(data.trust === "admin_4598"){
                req.user = true;
            }
        })
    }
    next();
})

async function login(req, res) {
    if(req.body.username === "admin_4598" && req.body.password === "FTSI-istf"){
        res.cookie('secret', jwt.sign({trust: req.body.username, exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)}, "rf01Amaio2974bnxc77fa93h3hbnc93280a"), {maxAge: 24*60*60, httpOnly: true, secure: true});
        return res.render("admin", {user: true});
    }else{
        res.redirect("/");
    }
}

async function home(req, res){
    return res.render("admin", {user: req.user});
}

async function newTagPage(req, res){
    if(!req.user) return res.redirect("/");
    let data = {};
    data.tags = req.tags;
    return res.render('tag', data);
}

async function newPostPage(req, res){
    if(!req.user) return res.redirect("/");
    let data = {};
    data.tags = req.tags;
    return res.render('form', data);
}

async function newTag(req, res) {
    if(!req.user) return res.redirect("/");
    if(req.body.name!==undefined && req.body.name!==""){
        let exists = await Tag.exists({name: req.body.name});
        if(exists) return res.redirect("/admin");
        let tag = new Tag({name: req.body.name});
        tag.save();
        console.log("New Tag Added");
        return res.redirect("/admin");
    }
    return res.redirect("/admin");
}

async function newPost(req, res){
    if(!req.user) return res.redirect("/");
    
    let title = req.body.title,
        desc = req.body.desc,
        links = req.body.link,
        pnames = req.body.peoplename,
        plinks = req.body.peoplelink,
        tag = req.body.tag;
    if ((title!==undefined && title!="")&&
        (desc!==undefined && desc!="")&&
        (tag!==undefined && tag!=""))
    {
        let tagobj = await Tag.findOne({name: tag});
        // console.log(tagobj)
        let post = new Post({
            title: title,
            desc: desc,
            tag: tagobj._id
        });
        // console.log(post)
        if(typeof(links)===typeof("text")){
            post.links.push(links);
        }else{
            for(let i=0; i<links.length || 0; i++){
                post.links.push(links[i]);
            }
        }
        if(typeof(pnames)===typeof("text")){
            post.people.push({
                name: pnames,
                link: plinks
            });
        }else{
            for(let i=0; i<pnames.length ||0; i++){
                post.people.push({
                    name: pnames[i],
                    link: plinks[i]
                });
            }
        }
        try{
            await post.save();
        }catch(e){
            // console.log(e);
            return res.redirect("/admin");
        }
        console.log("New Post Added to "+tag);
        return res.redirect("/admin");
    }
}

router.post("/newtag", newTag);
router.post("/newpost", newPost);
router.get("/newtag", newTagPage);
router.get("/newpost", newPostPage);


router.get("", home);
router.post("", login)

module.exports = router;
