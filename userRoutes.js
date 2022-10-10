const express = require('express');
const router = express.Router();

const {Post, Tag} = require("./model");

const DEFAULT_QUERY_PAGE = 1;
const DEFAULT_QUERY_PERPAGE = 10;

async function getAllTags(req, res) {
    const tags = Tag.find({}, {name: 1, _id:0});
    return res.status(200).json(tags);
}

async function getPaginatedPosts(req, res){
    var page = req.query.page ? Math.max(1, Number(req.query.page)) : DEFAULT_QUERY_PAGE;
    var perpage = Number(req.query.perpage) || DEFAULT_QUERY_PERPAGE;

    const query = {
        "tag.name" : req.params.tag
    };

    let options = {
        page: page,
        limit: perpage,
        populate: {
            path: "tag"
        },
        select:"title desc links people tag.name"
    }

    let posts = await Post.paginate(query, options);
    return res.status(200).json(posts);
}


router.get("/tags", getAllTags);
router.get("/posts/:tag", getPaginatedPosts);

module.exports = router;