const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const Jdtoemployee = require('../models/jdtoemployee');

router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let fieldJdtoemployee = {
    jdid: req.body.jdid,
    employeeid: req.body.employeeid,
    companyid: req.user.companyid
  };
  Jdtoemployee.findOne({jdid: req.body.jdid})
  .then(jdtoemployee => {
    if(jdtoemployee) {
      Jdtoemployee.updateJdtoemployee(req.body.jdid, fieldJdtoemployee, (err, jdtoemployee) => {
        if(err) {
          res.json({success: false, msg: 'Failed to update Jdtoemployee'});
        } else {
          res.json({success: true, msg: 'Jdtoemployee Updated'});
        }
      });
    } else {
      Jdtoemployee.addJdtoemployee(new Jdtoemployee(fieldJdtoemployee), (err, jdtoemployee) => {
        if(err){
          res.json({success: false, msg: 'Failed to add Jdtoemployee'});
        }else{
          res.json({success: true, msg: 'Jdtoemployee Add', data: jdtoemployee});
        }
      });
    }
  })
  .catch(err => conaole.log(err));


});

router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Jdtoemployee.find({companyid: req.user.companyid})
  .then(jdtoemployee => {
    res.json({success: true, data: jdtoemployee});
  })
  .catch(err => console.log(err));
});

router.get('/:jdid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Jdtoemployee.find({ $or: [{'companyid': req.user.companyid},{'jdid' : req.params.jdid}] })
  .then(jdtoemployee => {
    res.json({success: true, data: jdtoemployee});
  })
  .catch(err => console.log(err));
});

router.delete('/:jdtoemployeeid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Jdtoemployee.getJdtoemployeeById(req.params.jdtoemployeeid, (err, jdtoemployee) => {
    if (jdtoemployee) {
      if(jdtoemployee.companyid.toString() === req.user.companyid.toString()) {
        Jdtoemployee.deleteJdtoemployee(req.params.jdtoemployeeid, (err, result) => {
          if(err){
            res.json({success: false, msg: 'Failed to delete Jdtoemployee'});
          }else{
            res.json({success: true, msg: 'Jdtoemployee deleted successfully'});
          }
        });
      } else {
        res.json({success: false, msg: 'Your not allowed to delete'});
      }
    } else {
      res.json({success: false, msg: 'Jdtoemployee not found'});
    }
  });
});
module.exports = router;
