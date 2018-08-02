const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const Department = require('../models/department');

router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let fieldDepartment = {
      name: req.body.name,
      companyid: req.user.companyid,
      role: req.user.role
  };

  if(req.body.departmentid) {
    Department.updateDepartment(req.body.departmentid, fieldDepartment, (err, department) => {
      if(err) {
        res.json({success: false, msg: 'Failed to update Department'});
      } else {
        res.json({success: true, msg: 'Department Updated'});
      }
    });
  } else {
    Department.addDepartment(new Department(fieldDepartment), (err, department) => {
      if(err){
        res.json({success: false, msg: 'Failed to add Department'});
      }else{
          res.json({success: true, msg: 'Department Add', data: department});
      }
    });
  }

});

router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Department.find({companyid: req.user.companyid})
  .then(department => {
    res.json({success: true, data: department});
  })
  .catch(err => console.log(err));
});

router.delete('/:departmentid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Department.getDepartmentById(req.params.departmentid, (err, department) => {
    if (department) {
      if(department.companyid.toString() === req.user.companyid.toString()) {
        Department.deleteDepartment(req.params.departmentid, (err, result) => {
          if(err){
            res.json({success: false, msg: 'Failed to delete Department'});
          }else{
            res.json({success: true, msg: 'Department deleted successfully'});
          }
        });
      } else {
        res.json({success: false, msg: 'Your not allowed to delete'});
      }
    } else {
      res.json({success: false, msg: 'Department not found'});
    }
  });
});

module.exports = router;
