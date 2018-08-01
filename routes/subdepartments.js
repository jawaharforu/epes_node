const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const Subdepartment = require('../models/subdepartment');

router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let fieldSubdepartment = {
      name: req.body.name,
      departmentid: req.body.departmentid,
      companyid: req.user.companyid
  };

  if(req.body.subdepartmentid) {
    Subdepartment.updateSubdepartment(req.body.subdepartmentid, fieldSubdepartment, (err, subdepatment) => {
      if(err) {
        res.json({success: false, msg: 'Failed to update Sub department'});
      } else {
        res.json({success: true, msg: 'Sub department Updated'});
      }
    });
  } else {
    Subdepartment.addSubdepartment(new Subdepartment(fieldSubdepartment), (err, subdepartment) => {
      if(err){
        res.json({success: false, msg: 'Failed to add Sub department'});
      }else{
          res.json({success: true, msg: 'Sub department Add', data: subdepartment});
      }
    });
  }

});

router.get('/', (req, res, next) => {
  Subdepartment.find()
  .populate('departmentid')
  .then(subdepartment => {
    res.json({success: true, data: subdepartment});
  })
  .catch(err => console.log(err));
});

router.delete('/:subdepartmentid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Subdepartment.getSubdepartmentById(req.params.subdepartmentid, (err, subdepartment) => {
    if (subdepartment) {
      if(subdepartment.companyid.toString() === req.user.companyid.toString()) {
        Subdepartment.deleteSubdepartment(req.params.subdepartmentid, (err, result) => {
          if(err){
            res.json({success: false, msg: 'Failed to delete Sub department'});
          }else{
            res.json({success: true, msg: 'Sub department deleted successfully'});
          }
        });
      } else {
        res.json({success: false, msg: 'Your not allowed to delete'});
      }
    } else {
      res.json({success: false, msg: 'Sub department not found'});
    }
  });
});

router.get('/list/:departmentid', (req, res, next) => {
  Subdepartment.find({departmentid: req.params.departmentid})
  .populate('departmentid')
  .then(subdepartment => {
    res.json({success: true, data: subdepartment});
  })
  .catch(err => console.log(err));
});

module.exports = router;
