const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../../config/database');

const Pressrelease = require('../../models/frontend/pressrelease');

router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let fieldPressrelease = {
      name: req.body.name,
      image: req.body.image,
      status: req.body.status,
      companyid: req.user.companyid
  };

  if(req.body.pressreleaseid) {
    Pressrelease.updatePressrelease(req.body.pressreleaseid, fieldPressrelease, (err, pressrelease) => {
      if(err) {
        res.json({success: false, msg: 'Failed to update Pressrelease'});
      } else {
        res.json({success: true, msg: 'Pressrelease Updated'});
      }
    });
  } else {
    Pressrelease.addPressrelease(new Pressrelease(fieldPressrelease), (err, pressrelease) => {
      if(err){
        res.json({success: false, msg: 'Failed to add Pressrelease'});
      }else{
          res.json({success: true, msg: 'Pressrelease Add', data: pressrelease});
      }
    });
  }
});

router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Pressrelease.find()
  .then(pressrelease => {
    res.json({success: true, data: pressrelease});
  })
  .catch(err => console.log(err));
});

router.delete('/:pressreleaseid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Pressrelease.getPressreleaseById(req.params.pressreleaseid, (err, pressrelease) => {
    if (pressrelease) {
      if(pressrelease.companyid.toString() === req.user.companyid.toString()) {
        Pressrelease.deletePressrelease(req.params.pressreleaseid, (err, result) => {
          if(err){
            res.json({success: false, msg: 'Failed to delete Pressrelease'});
          }else{
            res.json({success: true, msg: 'Pressrelease deleted successfully'});
          }
        });
      } else {
        res.json({success: false, msg: 'Your not allowed to delete'});
      }
    } else {
      res.json({success: false, msg: 'Pressrelease not found'});
    }
  });
});

router.get('/:pressreleaseid', (req, res, next) => {
  Pressrelease.gerPressreleaseById(req.params.pressreleaseid, (err, pressrelease) => {
    if (pressrelease) {
      res.json({success: true, data: pressrelease});
    } else {
      res.json({success: false, msg: 'Pressrelease not found'});
    }
  });
});

router.get('/get/list', (req, res) => {
  Pressrelease.find({status: true})
  .then(pressrelease => {
    res.json({success: true, data: pressrelease});
  })
  .catch(err => console.log(err));
});

module.exports = router;
