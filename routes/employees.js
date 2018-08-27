const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const Employee = require('../models/employee');
const Organogram = require('../models/organogram');
const mongoose = require('mongoose');
const Jdtoemployee = require('../models/jdtoemployee');
const Jdquestion = require('../models/jdquestion');
const Question = require('../models/question');

router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let fieldEmployee = {
      employeenum: req.body.employeenum,
      employeename: req.body.employeename,
      employeetype: req.body.employeetype,
      experience: req.body.experience,
      designation: req.body.designation,
      email: req.body.email,
      countrycode: req.body.countrycode,
      mobile: req.body.mobile,
      address: req.body.address,
      status: req.body.status,
      organogramid: req.body.organogramid,
      companyid: req.user.companyid
  };

  if(req.body.employeeid) {
    Employee.updateEmployee(req.body.employeeid, fieldEmployee, (err, Employee) => {
      if(err) {
        res.json({success: false, msg: 'Failed to update Employee'});
      } else {
        res.json({success: true, msg: 'Employee Updated'});
      }
    });
  } else {
    Employee.addEmployee(new Employee(fieldEmployee), (err, Employee) => {
      if(err){
        res.json({success: false, msg: 'Failed to add Employee'});
      }else{
          res.json({success: true, msg: 'Employee Add', data: Employee});
      }
    });
  }

});

router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Employee.find({companyid: req.user.companyid})
  .then(employee => {
    res.json({success: true, data: employee});
  })
  .catch(err => console.log(err));
});

router.delete('/:employeeid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Employee.getEmployeeById(req.params.employeeid, (err, employee) => {
    if (employee) {
      if(employee.companyid.toString() === req.user.companyid.toString()) {
        Employee.deleteEmployee(req.params.employeeid, (err, result) => {
          if(err){
            res.json({success: false, msg: 'Failed to delete Employee'});
          }else{
            res.json({success: true, msg: 'Employee deleted successfully'});
          }
        });
      } else {
        res.json({success: false, msg: 'Your not allowed to delete'});
      }
    } else {
      res.json({success: false, msg: 'Employee not found'});
    }
  });
});

router.get('/:employeeid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Employee.getEmployeeById(req.params.employeeid, (err, employee) => {
    if (employee) {
      res.json({success: true, data: employee});
    } else {
      res.json({success: false, msg: 'Employee not found'});
    }
  });
});

router.get('/getbylevel/:organogramid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Employee.find({organogramid: req.params.organogramid})
  .then(employee => {
    res.json({success: true, data: employee});
  })
  .catch(err => console.log(err));
});

router.post('/authendicate', (req, res, next) => {
  //res.send('authendicate');
  const email = req.body.email;
  const password = req.body.password;

  Employee.getEmployeeByEmailCheck(email, (err, employee) => {
      if(err) throw err;
      if(!employee){
        res.json({success:false, msg: "Employee not found"});
      } else {
        let userDetail = {
            id: employee._id,
            employeenum: employee.employeenum,
            employeename: employee.employeename,
            employeetype: employee.employeetype,
            experience: employee.experience,
            designation: employee.designation,
            email: employee.email,
            countrycode: employee.countrycode,
            mobile: employee.mobile,
            address: employee.address,
            status: employee.status,
            organogramid: employee.organogramid,
            companyid: employee.companyid,
            role: 'employee',
        };
        const token = jwt.sign(userDetail, config.secret, {
            expiresIn: 604800 // 1 week
        });

        res.json({
            success: true,
            token: 'JWT '+token,
            user: {
              id: employee._id,
              employeenum: employee.employeenum,
              employeename: employee.employeename,
              employeetype: employee.employeetype,
              experience: employee.experience,
              designation: employee.designation,
              email: employee.email,
              countrycode: employee.countrycode,
              mobile: employee.mobile,
              address: employee.address,
              status: employee.status,
              organogramid: employee.organogramid,
              companyid: employee.companyid,
              role: 'employee',
            }
        });
      }
  });
});

router.post('/checkuser/email', (req, res, next) => {
  Employee.findOne({email: req.body.email}).then(employee => {
    if(!employee){
      res.json({success:false, msg: "Employee not found"});
    }else{
      res.json({success:true, msg: "Employee exist", data: employee});
    }
  }).catch(err => res.json(err));
});

router.get('/get/sublevel/:employeeid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Employee.getEmployeeById(req.params.employeeid, (err, employee) => {
    if (employee) {
      Organogram.findById(employee.organogramid)
      .then(organogram => {
        if (organogram) {
          Organogram.find({parentid: organogram.uniqueid})
          .then(childorganogram => {
            Employee.find({
              "organogramid" : {
                "$in" : childorganogram.map(item => {
                  return mongoose.Types.ObjectId(item._id);
                })
               }
            })
            .then(childemployees => {
              Jdtoemployee.find({employeeid: { "$in" : childemployees.map(item => {
                return mongoose.Types.ObjectId(item._id);
              })
              } })
              .then(jds => {
                Jdquestion.find({jdid: jds[0].jdid})
                .populate({path: 'questionid', populate: [{path: 'scaleid'},{path: 'assessmenttypeid'},{path: 'headerid'}]})
                .then(jdquestion => {
                  res.json({success: true, data: jdquestion});
                })
                .catch(err => console.log(err));
              })
              .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
          })
          .catch(err => console.log(err));
        } else {
          res.json({success: false, msg: 'Employee not found'});
        }
      })
      .catch(err => console.log(err));
    } else {
      res.json({success: false, msg: 'Employee not found'});
    }
  });
});

router.get('/get/highlevel/:employeeid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Employee.getEmployeeById(req.params.employeeid, (err, employee) => {
    if (employee) {
      Organogram.findById(employee.organogramid)
      .then(organogram => {
        if (organogram) {
          Organogram.find({uniqueid: organogram.parentid})
          .then(childorganogram => {
            Employee.find({
              "organogramid" : {
                "$in" : childorganogram.map(item => {
                  return mongoose.Types.ObjectId(item._id);
                })
               }
            })
            .then(childemployees => {
              console.log(childemployees);
              Jdtoemployee.find({employeeid: { "$in" : childemployees.map(item => {
                return mongoose.Types.ObjectId(item._id);
              })
              } })
              .populate('employeeid')
              .then(jds => {
                Jdquestion.find({jdid: jds[0].jdid}, {$set:{"emp":jds[0].employeeid}})
                .populate({path: 'questionid', populate: [{path: 'scaleid'},{path: 'assessmenttypeid'},{path: 'headerid'}]})
                .then(jdquestion => {
                  res.json({success: true, data: jdquestion});
                })
                .catch(err => console.log(err));
              })
              .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
          })
          .catch(err => console.log(err));
        } else {
          res.json({success: false, msg: 'Employee not found'});
        }
      })
      .catch(err => console.log(err));
    } else {
      res.json({success: false, msg: 'Employee not found'});
    }
  });
});

module.exports = router;
