const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const Question = require('../models/question');

router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let fieldQuestion = {
    question: req.body.question,
    scaleid: req.body.scaleid,
    assessment: req.body.assessment,
    headerid: req.body.headerid,
    companyid: req.body.companyid
  };

  if(req.body.questionid) {
    Question.updateScale(req.body.questionid, fieldQuestion, (err, scale) => {
      if(err) {
        res.json({success: false, msg: 'Failed to update Question'});
      } else {
        res.json({success: true, msg: 'Question Updated'});
      }
    });
  } else {
    Question.addScale(new Question(fieldQuestion), (err, question) => {
      if(err){
        res.json({success: false, msg: 'Failed to add Question'});
      }else{
        res.json({success: true, msg: 'Question Add', data: question});
      }
    });
  }

});

router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Question.find({companyid: req.user.companyid})
  .populate('scale')
  .populate('header')
  .then(question => {
    res.json({success: true, data: question});
  })
  .catch(err => console.log(err));
});

module.exports = router;
