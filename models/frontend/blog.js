const mongoose = require('mongoose');
const config = require('../../config/database');
const Company = require('../company');

const BlogSchema = mongoose.Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    image: {
      type: String
    },
    status: {
        type: Boolean,
        default: true
    },
    companyid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true,'No Company id found']
    },
    createdon: {
        type: Date,
        default: Date.now
    },
    updatedon: {
        type: Date,
        default: Date.now
    }
});

const Blog = module.exports = mongoose.model('Blog', BlogSchema);

module.exports.addBlog = function(newBlog, callback){
    newBlog.save(callback);
};

module.exports.deleteBlog = function(Blogid, callback){
    Blog.remove({_id: Blogid}, callback);
};

module.exports.updateBlog = function(Blogid, updateResult, callback){
    Blog.update({_id: Blogid},updateResult, callback);
};

module.exports.getBlogById = function(Blogid, callback){
    Blog.findById(Blogid, callback);
};
