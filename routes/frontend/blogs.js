const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../../config/database');

const Blog = require('../../models/frontend/blog');

router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let fieldBlog = {
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
      status: req.body.status,
      companyid: req.user.companyid
  };

  if(req.body.blogid) {
    Blog.updateBlog(req.body.blogid, fieldBlog, (err, blog) => {
      if(err) {
        res.json({success: false, msg: 'Failed to update Blog'});
      } else {
        res.json({success: true, msg: 'Blog Updated'});
      }
    });
  } else {
    Blog.addBlog(new Blog(fieldBlog), (err, blog) => {
      if(err){
        res.json({success: false, msg: 'Failed to add Blog'});
      }else{
          res.json({success: true, msg: 'Blog Add', data: blog});
      }
    });
  }
});

router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Blog.find()
  .then(Blog => {
    res.json({success: true, data: Blog});
  })
  .catch(err => console.log(err));
});

router.delete('/:blogid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Blog.getBlogById(req.params.blogid, (err, blog) => {
    if (blog) {
      if(blog.companyid.toString() === req.user.companyid.toString()) {
        Blog.deleteBlog(req.params.blogid, (err, result) => {
          if(err){
            res.json({success: false, msg: 'Failed to delete Blog'});
          }else{
            res.json({success: true, msg: 'Blog deleted successfully'});
          }
        });
      } else {
        res.json({success: false, msg: 'Your not allowed to delete'});
      }
    } else {
      res.json({success: false, msg: 'Blog not found'});
    }
  });
});

router.get('/:blogid', (req, res, next) => {
  Blog.gerBlogById(req.params.blogid, (err, blog) => {
    if (blog) {
      res.json({success: true, data: Blog});
    } else {
      res.json({success: false, msg: 'Blog not found'});
    }
  });
});

router.get('/get/list', (req, res) => {
  Blog.find({status: true})
  .then(blog => {
    res.json({success: true, data: blog});
  })
  .catch(err => console.log(err));
});

module.exports = router;
