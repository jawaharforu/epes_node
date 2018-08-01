const express = require('express');
const router = express.Router();
const passport = require('passport');
const multer = require('multer');
const path = require('path');

var CountryCodes = require('../../json/CountryCodes.json');

router.get('/countryCodes', function (req, res, next) {
  res.json({success: true, data: CountryCodes});
});

// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/images/',
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
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}

router.post('/upload/image', (req, res, next) => {
  upload(req,res,function(err){
    if(err){
         res.json({success: false, msg: 'Upload Failed!!!', err: err});
         return;
    } else {
      if(req.file == undefined){
        res.render('index', {
          msg: 'Error: No File Selected!'
        });
      } else {
        var filename = req.file.filename; // parses a file
        res.json({success: true, msg: 'Image Uploaded!', filename: filename});
      }
    }
  });
});


module.exports = router;
