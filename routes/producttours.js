const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const Producttour = require('../models/producttour');

router.post('/', (req, res, next) => {
  let fieldProducttour = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      industry: req.body.industry,
      email: req.body.email,
      noofemployees: req.body.noofemployees,
      company: req.body.company,
      contact: req.body.contact,
      country: req.body.country,
      status: req.body.status
  };

  if(req.body.producttourid) {
    Producttour.updateProducttour(req.body.producttourid, fieldProducttour, (err, Producttour) => {
      if(err) {
        res.json({success: false, msg: 'Failed to update Producttour'});
      } else {
        res.json({success: true, msg: 'Producttour Updated'});
      }
    });
  } else {
    Producttour.addProducttour(new Producttour(fieldProducttour), (err, producttour) => {
      if(err) {
        res.json({success: false, msg: 'Failed to add Producttour'});
      } else {
        res.json({success: true, msg: 'Producttour Add', data: producttour});
      }
    });
  }
});

router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  if(req.user.role === 'superadmin') {
    Producttour.find()
    .then(producttour => {
      res.json({success: true, data: producttour});
    })
    .catch(err => console.log(err));
  } else {
    res.json({success: false, data: 'Your not allowed'});
  }
});

router.delete('/:producttourid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Producttour.getProducttourById(req.params.producttourid, (err, producttour) => {
    if (producttour) {
      if(req.user.role === 'superadmin') {
        Producttour.deleteProducttour(req.params.producttourid, (err, result) => {
          if(err){
            res.json({success: false, msg: 'Failed to delete Producttour'});
          }else{
            res.json({success: true, msg: 'Producttour deleted successfully'});
          }
        });
      } else {
        res.json({success: false, msg: 'Your not allowed to delete'});
      }
    } else {
      res.json({success: false, msg: 'Producttour not found'});
    }
  });
});

router.get('/:producttourid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Producttour.getProducttourById(req.params.producttourid, (err, producttour) => {
    if (producttour) {
      if(req.user.role === 'superadmin' || producttour._id.toString() === req.user.producttourid.toString()) {
        res.json({success: true, data: producttour});
      } else {
        res.json({success: false, msg: 'Your not allowed to delete'});
      }
    } else {
      res.json({success: false, msg: 'Producttour not found'});
    }
  });
});

module.exports = router;
