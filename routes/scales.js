const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const Scale = require('../models/scale');

router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let fieldScale = {
    noofoption: req.body.noofoption,
    options: req.body.options,
    companyid: req.user.companyid
  };

  if(req.body.scaleid) {
    Scale.updateScale(req.body.scaleid, fieldScale, (err, scale) => {
      if(err) {
        res.json({success: false, msg: 'Failed to update Scale'});
      } else {
        res.json({success: true, msg: 'Scale Updated'});
      }
    });
  } else {
    Scale.addScale(new Scale(fieldScale), (err, scale) => {
      if(err){
        res.json({success: false, msg: 'Failed to add Scale'});
      }else{
        res.json({success: true, msg: 'Scale Add', data: scale});
      }
    });
  }

});

router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Scale.find({companyid: req.user.companyid})
  .then(scale => {
    res.json({success: true, data: scale});
  })
  .catch(err => console.log(err));
});

module.exports = router;
