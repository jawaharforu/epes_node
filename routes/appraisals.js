const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const Appraisal = require('../models/Appraisal');

router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let fieldAppraisal = {
    seniormanagerfixed: req.body.seniormanagerfixed,
    seniormanagervariable: req.body.seniormanagervariable,
    seniormanagerbonus: req.body.seniormanagerbonus,
    managerfixed: req.body.managerfixed,
    managervariable: req.body.managervariable,
    managerbonus: req.body.managerbonus,
    executivesfixed: req.body.executivesfixed,
    executivesvariable: req.body.executivesvariable,
    executivesbonus: req.body.executivesbonus,
    companyid: req.user.companyid
  };
  Appraisal.find({companyid: req.user.companyid})
  .then(appraisal => {
    if(appraisal) {
      Appraisal.updateAppraisal(req.body.appraisalid, fieldAppraisal, (err, appraisal) => {
        if(err) {
          res.json({success: false, msg: 'Failed to update Appraisal'});
        } else {
          res.json({success: true, msg: 'Appraisal Updated'});
        }
      });
    } else {
      Appraisal.addAppraisal(new Appraisal(fieldAppraisal), (err, appraisal) => {
        if(err){
          res.json({success: false, msg: 'Failed to add Appraisal'});
        }else{
          res.json({success: true, msg: 'Appraisal Add', data: appraisal});
        }
      });
    }
  })
  .catch(err => console.log(err));
});

router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Appraisal.find({companyid: req.user.companyid})
  .then(appraisal => {
    res.json({success: true, data: appraisal});
  })
  .catch(err => console.log(err));
});


router.delete('/:appraisalid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Appraisal.getAppraisalById(req.params.appraisalid, (err, appraisal) => {
    if (appraisal) {
      if(appraisal.companyid.toString() === req.user.companyid.toString()) {
        Appraisal.deleteAppraisal(req.params.appraisalid, (err, result) => {
          if(err){
            res.json({success: false, msg: 'Failed to delete Appraisal'});
          }else{
            res.json({success: true, msg: 'Appraisal deleted successfully'});
          }
        });
      } else {
        res.json({success: false, msg: 'Your not allowed to delete'});
      }
    } else {
      res.json({success: false, msg: 'Appraisal not found'});
    }
  });
});
module.exports = router;
