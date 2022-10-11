const express = require("express");
const router = express.Router();
const { Post, Tag } = require("./model");

const DEFAULT_QUERY_PAGE = 1;
const DEFAULT_QUERY_PERPAGE = 10;

// async function getAllTags(req, res) {
//     const tags = Tag.find({}, {name: 1, _id:0});
//     return res.status(200).json(tags);
// }

async function getPaginatedPosts(req, res) {
  let data = {};
  data.tags = req.tags;
  const query = {
    // "tag.name" : req.params.tag,
  };
  req.params.tag = req.params.tag.replace(/\+/g, " ");
  let options = {
    populate: {
      path: "tag",
      select: "name -_id",
      match: {
        name: req.params.tag,
      },
    },
    select: "title desc links people tag updatedAt",
    order: {
      updatedAt: -1,
    },
  };
  data.posts = await Post.find(query)
    .select(options.select)
    .populate(options.populate)
    .sort(options.order);
  data.posts = data.posts.filter((post) => {
    return post.tag !== null;
  });
  data.postlength = data.posts.length;
  return res.render("topic", data);
}

function home(req, res) {
  let data = {};
  data.tags = req.tags;
  return res.render("index", data);
}

// router.get("/tags", getAllTags);
router.get("/posts/:tag", getPaginatedPosts);
router.get("/", home);

module.exports = router;
