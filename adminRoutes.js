const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {Post, Tag} = require("./model");

module.exports = router;

async function newTag(req, res) {
    let data = {};
    data.tags = req.tags;
    if(req.body.name!==undefined && req.body.name!==""){
        let exists = await Tag.exists({name: req.body.name});
        if(exists) return res.status(401).json({"error": "exists"});
        let tag = new Tag({name: req.body.name});
        tag.save();
        data.newTag = tag;
        data.tags.push({"name":tag.name});
        return res.status(201).json(data);
    }
    return res.status(401).json({"error":"invalid"});
}

async function newPost(req, res){
    let data = {};
    data.tags = req.tags;
    
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
        for(let i=0; i<links.length || 0; i++){
            post.links.push(links[i]);
        }
        for(let i=0; i<pnames.length ||0; i++){
            post.people.push({
                name: pnames[i],
                link: plinks[i]
            });
        }
        try{
            await post.save();
        }catch(e){
            return res.status(400).json({"error": "Invalid Field Data"})
        }
        data.post = post;
        return res.status(201).json(data);
    }
}

router.post("/newtag", newTag);
router.post("/newpost", newPost);
module.exports = router;
