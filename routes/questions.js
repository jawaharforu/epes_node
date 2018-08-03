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
    assessmenttypeid: req.body.assessmenttypeid,
    headerid: req.body.headerid,
    type: req.body.type,
    companyid: req.user.companyid,
    role: req.user.role
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
    Question.addQuestion(new Question(fieldQuestion), (err, question) => {
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
  .populate('scaleid')
  .populate('assessmenttypeid')
  .populate('headerid')
  .then(question => {
    res.json({success: true, data: question});
  })
  .catch(err => console.log(err));
});

router.get('/getlist', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Question.find({ $or: [{'companyid': req.user.companyid},{'role' : 'superadmin'}] })
  .populate('scaleid')
  .populate('assessmenttypeid')
  .populate('headerid')
  .then(question => {
    res.json({success: true, data: question});
  })
  .catch(err => console.log(err));
});

router.delete('/:questionid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Question.getQuestionById(req.params.questionid, (err, question) => {
    if (question) {
      if(question.companyid.toString() === req.user.companyid.toString()) {
        Question.deleteQuestion(req.params.questionid, (err, result) => {
          if(err){
            res.json({success: false, msg: 'Failed to delete Question'});
          }else{
            res.json({success: true, msg: 'Question deleted successfully'});
          }
        });
      } else {
        res.json({success: false, msg: 'Your not allowed to delete'});
      }
    } else {
      res.json({success: false, msg: 'Question not found'});
    }
  });
});
module.exports = router;
