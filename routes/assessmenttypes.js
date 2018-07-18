const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const Assessmenttype = require('../models/assessmenttype');

router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let fieldAssessmenttype = {
    name: req.body.name,
    companyid: req.user.companyid,
    role: req.user.role
  };

  if(req.body.assessmenttypeid) {
    Assessmenttype.updateAssessmenttype(req.body.assessmenttypeid, fieldAssessmenttype, (err, Assessmenttype) => {
      if(err) {
        res.json({success: false, msg: 'Failed to update Assessment type'});
      } else {
        res.json({success: true, msg: 'Assessment type Updated'});
      }
    });
  } else {
    Assessmenttype.addAssessmenttype(new Assessmenttype(fieldAssessmenttype), (err, Assessmenttype) => {
      if(err){
        res.json({success: false, msg: 'Failed to add Assessment type'});
      }else{
        res.json({success: true, msg: 'Assessment type Add', data: Assessmenttype});
      }
    });
  }

});

router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Assessmenttype.find({companyid: req.user.companyid})
  .then(Assessmenttype => {
    res.json({success: true, data: Assessmenttype});
  })
  .catch(err => console.log(err));
});

router.get('/getlist', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Assessmenttype.find({ $or: [{'companyid': req.user.companyid},{'role' : 'superadmin'}] })
  .then(scale => {
    res.json({success: true, data: scale});
  })
  .catch(err => console.log(err));
});

router.delete('/:assessmenttypeid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Assessmenttype.getAssessmenttypeById(req.params.assessmenttypeid, (err, assessmenttype) => {
    if (assessmenttype) {
      if(assessmenttype.companyid.toString() === req.user.companyid.toString()) {
        Assessmenttype.deleteAssessmenttype(req.params.assessmenttypeid, (err, result) => {
          if(err){
            res.json({success: false, msg: 'Failed to delete Assessment type'});
          }else{
            res.json({success: true, msg: 'Assessment type deleted successfully'});
          }
        });
      } else {
        res.json({success: false, msg: 'Your not allowed to delete'});
      }
    } else {
      res.json({success: false, msg: 'Assessment type not found'});
    }
  });
});

module.exports = router;
