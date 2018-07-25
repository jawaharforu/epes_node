const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const Depatment = require('../models/department');

router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let fieldDepatment = {
      name: req.body.name,
      companyid: req.user.companyid
  };

  if(req.body.depatmentid) {
    Depatment.updateDepatment(req.body.depatmentid, fieldDepatment, (err, depatment) => {
      if(err) {
        res.json({success: false, msg: 'Failed to update Faq category'});
      } else {
        res.json({success: true, msg: 'Faq category Updated'});
      }
    });
  } else {
    Depatment.addDepatment(new Depatment(fieldDepatment), (err, depatment) => {
      if(err){
        res.json({success: false, msg: 'Failed to add Faq category'});
      }else{
          res.json({success: true, msg: 'Faq category Add', data: depatment});
      }
    });
  }

});

router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Depatment.find()
  .then(depatment => {
    res.json({success: true, data: depatment});
  })
  .catch(err => console.log(err));
});

router.delete('/:depatmentid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Depatment.getDepatmentById(req.params.Depatmentid, (err, depatment) => {
    if (depatment) {
      if(depatment.companyid.toString() === req.user.companyid.toString()) {
        Depatment.deleteDepatment(req.params.depatmentid, (err, result) => {
          if(err){
            res.json({success: false, msg: 'Failed to delete Faq category'});
          }else{
            res.json({success: true, msg: 'Faq category deleted successfully'});
          }
        });
      } else {
        res.json({success: false, msg: 'Your not allowed to delete'});
      }
    } else {
      res.json({success: false, msg: 'Faq category not found'});
    }
  });
});

module.exports = router;
