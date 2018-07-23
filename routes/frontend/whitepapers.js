const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../../config/database');

const Whitepaper = require('../../models/frontend/Whitepaper');

router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let fieldWhitepaper = {
      name: req.body.name,
      email: req.body.email,
      company: req.body.company,
      website: req.user.website,
      role: 'superadmin'
  };

  if(req.body.whitepaperid) {
    Whitepaper.updateWhitepaper(req.body.whitepaperid, fieldWhitepaper, (err, whitepaper) => {
      if(err) {
        res.json({success: false, msg: 'Failed to update Whitepaper'});
      } else {
        res.json({success: true, msg: 'Whitepaper Updated'});
      }
    });
  } else {
    Whitepaper.addWhitepaper(new Whitepaper(fieldWhitepaper), (err, whitepaper) => {
      if(err){
        res.json({success: false, msg: 'Failed to add Whitepaper'});
      }else{
          res.json({success: true, msg: 'Whitepaper Add', data: whitepaper});
      }
    });
  }
});

router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Whitepaper.find()
  .then(whitepaper => {
    res.json({success: true, data: whitepaper});
  })
  .catch(err => console.log(err));
});

router.delete('/:whitepaperid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Whitepaper.getWhitepaperById(req.params.whitepaperid, (err, whitepaper) => {
    if (whitepaper) {
      if(whitepaper.role.toString() === req.user.role.toString()) {
        Whitepaper.deleteWhitepaper(req.params.whitepaperid, (err, result) => {
          if(err){
            res.json({success: false, msg: 'Failed to delete Whitepaper'});
          }else{
            res.json({success: true, msg: 'Whitepaper deleted successfully'});
          }
        });
      } else {
        res.json({success: false, msg: 'Your not allowed to delete'});
      }
    } else {
      res.json({success: false, msg: 'Whitepaper not found'});
    }
  });
});

router.get('/:whitepaperid', (req, res, next) => {
  Whitepaper.gerWhitepaperById(req.params.whitepaperid, (err, whitepaper) => {
    if (whitepaper) {
      res.json({success: true, data: whitepaper});
    } else {
      res.json({success: false, msg: 'Whitepaper not found'});
    }
  });
});

router.get('/get/list', (req, res) => {
  Whitepaper.find({status: true})
  .then(whitepaper => {
    res.json({success: true, data: whitepaper});
  })
  .catch(err => console.log(err));
});

module.exports = router;
