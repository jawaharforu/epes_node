const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const Jdquestion = require('../models/jdquestion');

router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let fieldJdquestion = {
    jdid: req.body.jdid,
    questionid: req.body.questionid,
    companyid: req.body.companyid
  };
  Jdquestion.findOne({jdid: req.body.jdid})
  .then(jdquestion => {
    if(jdquestion) {
      Jdquestion.updateJdquestion(req.body.jdid, fieldJdquestion, (err, jdquestion) => {
        if(err) {
          res.json({success: false, msg: 'Failed to update Jdquestion'});
        } else {
          res.json({success: true, msg: 'Jdquestion Updated'});
        }
      });
    } else {
      Jdquestion.addJdquestion(new Jdquestion(fieldJdquestion), (err, jdquestion) => {
        if(err){
          res.json({success: false, msg: 'Failed to add Jdquestion'});
        }else{
          res.json({success: true, msg: 'Jdquestion Add', data: jdquestion});
        }
      });
    }
  })
  .catch(err => console.log(err));
});

router.get('/list', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Jdquestion.find({companyid: req.user.companyid})
  .then(jdquestion => {
    res.json({success: true, data: jdquestion});
  })
  .catch(err => console.log(err));
});

module.exports = router;
