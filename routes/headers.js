const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const Header = require('../models/header');

router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let fieldHeader = {
    headername: req.body.headername,
    description: req.body.description,
    companyid: req.user.companyid
  };

  if(req.body.headerid) {
    Header.updateHeader(req.body.headerid, fieldHeader, (err, header) => {
      if(err) {
        res.json({success: false, msg: 'Failed to update Header'});
      } else {
        res.json({success: true, msg: 'Header Updated'});
      }
    });
  } else {
    Header.addHeader(new Header(fieldHeader), (err, header) => {
      if(err){
        res.json({success: false, msg: 'Failed to add Header'});
      }else{
        res.json({success: true, msg: 'Header Add', data: header});
      }
    });
  }

});

router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Header.find({companyid: req.user.companyid})
  .then(header => {
    res.json({success: true, data: header});
  })
  .catch(err => console.log(err));
});

module.exports = router;
