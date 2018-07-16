const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const Approver = require('../models/approver');

router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let fieldApprover = {
      name: req.body.name,
      email: req.body.email,
      designation: req.body.designation,
      companyid: req.user.companyid
  };

  if(req.body.approverid) {
    Approver.updateApprover(req.body.approverid, fieldApprover, (err, approver) => {
      if(err) {
        res.json({success: false, msg: 'Failed to update Approver'});
      } else {
        res.json({success: true, msg: 'Approver Updated'});
      }
    });
  } else {
    Approver.addApprover(new Approver(fieldApprover), (err, approver) => {
      if(err){
        res.json({success: false, msg: 'Failed to add Approver'});
      }else{
          res.json({success: true, msg: 'Approver Add', data: approver});
      }
    });
  }

});

router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Approver.find({companyid: req.user.companyid})
  .then(approver => {
    res.json({success: true, data: approver});
  })
  .catch(err => console.log(err));
});

router.delete('/:approverid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Approver.gerApproverById(req.params.approverid, (err, approver) => {
    if (approver) {
      if(approver.companyid.toString() === req.user.companyid.toString()) {
        Approver.deleteApprover(req.params.approverid, (err, result) => {
          if(err){
            res.json({success: false, msg: 'Failed to delete Approver'});
          }else{
            res.json({success: true, msg: 'Approver deleted successfully'});
          }
        });
      } else {
        res.json({success: false, msg: 'Your not allowed to delete'});
      }
    } else {
      res.json({success: false, msg: 'Approver not found'});
    }
  });
});

module.exports = router;
