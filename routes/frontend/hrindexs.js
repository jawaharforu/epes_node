const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../../config/database');

const HRindex = require('../../models/frontend/hrindex');

router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let fieldHRindex = {
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      designation: req.body.designation,
      companyname: req.body.companyname,
      industry: req.body.industry,
      staffing: req.body.staffing,
      traininganddevelopment: req.body.traininganddevelopment,
      performancesystems: req.body.performancesystems,
      safetyandhealth: req.body.safetyandhealth,
      labourrelations: req.body.labourrelations,
      internalcommunication: req.body.internalcommunication,
      diversity: req.body.diversity,
      role: 'superadmin'
  };

  if(req.body.hrindexid) {
    HRindex.updateHRindex(req.body.hrindexid, fieldHRindex, (err, hrindex) => {
      if(err) {
        res.json({success: false, msg: 'Failed to update HRindex'});
      } else {
        res.json({success: true, msg: 'HRindex Updated'});
      }
    });
  } else {
    HRindex.addHRindex(new HRindex(fieldHRindex), (err, hrindex) => {
      if(err){
        res.json({success: false, msg: 'Failed to add HRindex'});
      }else{
        res.json({success: true, msg: 'HRindex Add', data: hrindex});
      }
    });
  }
});

router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  HRindex.find()
  .then(hrindex => {
    res.json({success: true, data: hrindex});
  })
  .catch(err => console.log(err));
});

router.delete('/:hrindexid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  HRindex.getHRindexById(req.params.hrindexid, (err, hrindex) => {
    if (hrindex) {
      if(hrindex.role === req.user.role) {
        HRindex.deleteHRindex(req.params.hrindexid, (err, result) => {
          if(err){
            res.json({success: false, msg: 'Failed to delete HRindex'});
          }else{
            res.json({success: true, msg: 'HRindex deleted successfully'});
          }
        });
      } else {
        res.json({success: false, msg: 'Your not allowed to delete'});
      }
    } else {
      res.json({success: false, msg: 'HRindex not found'});
    }
  });
});

router.get('/:hrindexid', (req, res, next) => {
  HRindex.gerHRindexById(req.params.hrindexid, (err, hrindex) => {
    if (hrindex) {
      res.json({success: true, data: hrindex});
    } else {
      res.json({success: false, msg: 'HRindex not found'});
    }
  });
});

router.get('/get/list', (req, res) => {
  HRindex.find({status: true})
  .then(hrindex => {
    res.json({success: true, data: hrindex});
  })
  .catch(err => console.log(err));
});

module.exports = router;
