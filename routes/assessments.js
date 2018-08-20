const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const Assessment = require('../models/assessment');

router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let fieldAssessment = {
    title: req.body.title,
    type: req.body.type,
    periodoftime: req.body.periodoftime,
    durationfrom: req.body.durationfrom,
    durationto: req.body.durationto,
    duedate: req.body.duedate,
    description: req.body.description,
    companyid: req.user.companyid
  };

  if(req.body.assessmentid) {
    Assessment.updateAssessment(req.body.assessmentid, fieldAssessment, (err, assessment) => {
      if(err) {
        res.json({success: false, msg: 'Failed to update Assessment'});
      } else {
        res.json({success: true, msg: 'Assessment Updated'});
      }
    });
  } else {
    Assessment.addAssessment(new Assessment(fieldAssessment), (err, assessment) => {
      if(err){
        res.json({success: false, msg: 'Failed to add Assessment'});
      }else{
        res.json({success: true, msg: 'Assessment Add', data: assessment});
      }
    });
  }

});

router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Assessment.find({companyid: req.user.companyid})
  .then(assessment => {
    res.json({success: true, data: assessment});
  })
  .catch(err => console.log(err));
});

router.get('/:assessmentid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Assessment.getAssessmentById(req.params.assessmentid, (err, assessment) => {
    if (assessment) {
      res.json({success: true, data: assessment});
    } else {
      res.json({success: false, msg: 'Assessment not found'});
    }
  });
});

router.delete('/:assessmentid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Assessment.getAssessmentById(req.params.assessmentid, (err, assessment) => {
    if (assessment) {
      if(assessment.companyid.toString() === req.user.companyid.toString()) {
        Assessment.deleteAssessment(req.params.assessmentid, (err, result) => {
          if(err){
            res.json({success: false, msg: 'Failed to delete Assessment'});
          }else{
            res.json({success: true, msg: 'Assessment deleted successfully'});
          }
        });
      } else {
        res.json({success: false, msg: 'Your not allowed to delete'});
      }
    } else {
      res.json({success: false, msg: 'Assessment not found'});
    }
  });
});

router.get('/type/:type', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Assessment.find({ $and: [{'companyid': req.user.companyid},{'type' : req.params.type}] })
  .then(assessment => {
    res.json({success: true, data: assessment});
  })
  .catch(err => console.log(err));
});
module.exports = router;
