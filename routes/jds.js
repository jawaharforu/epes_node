const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const multer = require('multer');
const path = require('path');
const mammoth = require("mammoth");

const Jd = require('../models/jd');

/*
var storage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
      cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
      var datetimestamp = Date.now();
      cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
  }
});
var upload = multer({ //multer settings
  storage: storage
}).single('file');
*/
// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('file');

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /document|docx/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: DOCX file Only!');
  }
}

router.post('/upload', (req, res, next) => {
  upload(req,res,function(err){
    if(err){
         res.json({success: false, msg: 'Upload Failed!!!', err: err});
         return;
    }
    var filename = req.file.path; // parses a file
    mammoth.convertToHtml({path: `${filename}`})
    .then(function(result){
        var html = result.value; // The generated HTML
        var messages = result.messages; // Any messages, such as warnings during conversion
        res.json({success: true, msg: 'Imported Successfully', messages: messages, data: html, filename: filename});
    })
    .done();
  });
});

router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let fieldJd = {
    name: req.body.name,
    description: req.body.description,
    filename: req.body.filename,
    companyid: req.user.companyid
  };

  if(req.body.jdid) {
    Jd.updateJd(req.body.jdid, fieldJd, (err, jd) => {
      if(err) {
        res.json({success: false, msg: 'Failed to update JD'});
      } else {
        res.json({success: true, msg: 'JD Updated'});
      }
    });
  } else {
    Jd.addJd(new Jd(fieldJd), (err, jd) => {
      if(err) {
        res.json({success: false, msg: 'Failed to add JD'});
      } else {
        res.json({success: true, msg: 'JD Add', data: jd});
      }
    });
  }
});

router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Jd.find({companyid: req.user.companyid})
  .then(jd => {
    res.json({success: true, data: jd});
  })
  .catch(err => console.log(err));
});

router.delete('/:jdid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Jd.gerJdById(req.params.jdid, (err, jd) => {
    if (jd) {
      if(jd.companyid.toString() === req.user.companyid.toString()) {
        Jd.deleteJd(req.params.jdid, (err, result) => {
          if(err){
            res.json({success: false, msg: 'Failed to delete Jd'});
          }else{
            res.json({success: true, msg: 'Jd deleted successfully'});
          }
        });
      } else {
        res.json({success: false, msg: 'Your not allowed to delete'});
      }
    } else {
      res.json({success: false, msg: 'Jd not found'});
    }
  });
});

module.exports = router;
