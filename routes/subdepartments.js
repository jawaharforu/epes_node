const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const Subdepatment = require('../models/subdepartment');

router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let fieldSubdepatment = {
      name: req.body.name,
      departmentid: req.body.departmentid,
      companyid: req.user.companyid,
      role: req.user.role
  };

  if(req.body.subdepatmentid) {
    Subdepatment.updateSubdepatment(req.body.subdepatmentid, fieldSubdepatment, (err, subdepatment) => {
      if(err) {
        res.json({success: false, msg: 'Failed to update Faq sub category'});
      } else {
        res.json({success: true, msg: 'Faq sub category Updated'});
      }
    });
  } else {
    Subdepatment.addSubdepatment(new Subdepatment(fieldSubdepatment), (err, subdepatment) => {
      if(err){
        res.json({success: false, msg: 'Failed to add Faq sub category'});
      }else{
          res.json({success: true, msg: 'Faq sub category Add', data: subdepatment});
      }
    });
  }

});

router.get('/', (req, res, next) => {
  Subdepatment.find()
  .populate('departmentid')
  .then(subdepatment => {
    res.json({success: true, data: subdepatment});
  })
  .catch(err => console.log(err));
});

router.delete('/:subdepatmentid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Subdepatment.gerFaqcategoryById(req.params.subdepatmentid, (err, subdepatment) => {
    if (subdepatment) {
      if(subdepatment.companyid.toString() === req.user.companyid.toString()) {
        Subdepatment.deleteSubdepatment(req.params.subdepatmentid, (err, result) => {
          if(err){
            res.json({success: false, msg: 'Failed to delete Faq sub category'});
          }else{
            res.json({success: true, msg: 'Faq sub category deleted successfully'});
          }
        });
      } else {
        res.json({success: false, msg: 'Your not allowed to delete'});
      }
    } else {
      res.json({success: false, msg: 'Faq sub category not found'});
    }
  });
});

router.get('/list/:departmentid', (req, res, next) => {
  Subdepatment.find({departmentid: req.params.departmentid})
  .populate('departmentid')
  .then(subdepatment => {
    res.json({success: true, data: subdepatment});
  })
  .catch(err => console.log(err));
});

module.exports = router;
