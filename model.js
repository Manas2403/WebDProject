const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const LINK_REGEX = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/

const TagSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    }
})

const Tag = mongoose.Model("Tag", TagSchema);

const PostSchema = new mongoose.Schema({
    title: String,
    desc: String,
    links: [{
        type: String,
        match: LINK_REGEX
    }],
    people: [{
        name: String,
        link: {
            type: String,
            match: LINK_REGEX
        }
    }],
    tag:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag"
    }
})

PostSchema.plugin(mongoosePaginate);

const Post = mongoose.Model("Post", PostSchema);

module.exports.Post = Post;
module.exports.Tag = Tag;