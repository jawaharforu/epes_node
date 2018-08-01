const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const Company = require('../models/company');
const User = require('../models/user');

router.post('/', (req, res, next) => {
  let fieldCompany = {
      jobtitle: req.body.jobtitle,
      companyname: req.body.companyname,
      industry: req.body.industry,
      noofemployees: req.body.noofemployees,
      companycontact: req.body.companycontact,
      companyaddress: req.body.companyaddress,
      country: req.body.country,
      countrycode: req.body.countrycode,
      state: req.body.state,
      city: req.body.city,
      logo: req.body.logo,
      status: req.body.status
  };

  if(req.body.companyid) {
    Company.updateCompany(req.body.companyid, fieldCompany, (err, company) => {
      if(err) {
        res.json({success: false, msg: 'Failed to update Company'});
      } else {
        res.json({success: true, msg: 'Company Updated'});
      }
    });
  } else {
    Company.addCompany(new Company(fieldCompany), (err, company) => {
      if(err) {
        res.json({success: false, msg: 'Failed to add Company'});
      } else {
        res.json({success: true, msg: 'Company Add', data: company});
      }
    });
  }
});

router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  if(req.user.role === 'superadmin') {
    Company.find()
    .then(company => {
      res.json({success: true, data: company});
    })
    .catch(err => console.log(err));
  } else {
    res.json({success: false, data: 'Your not allowed'});
  }
});

router.delete('/:companyid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Company.getCompanyById(req.params.companyid, (err, company) => {
    if (company) {
      if(req.user.role === 'superadmin') {
        Company.deleteCompany(req.params.companyid, (err, result) => {
          if(err){
            res.json({success: false, msg: 'Failed to delete Company'});
          }else{
            res.json({success: true, msg: 'Company deleted successfully'});
          }
        });
      } else {
        res.json({success: false, msg: 'Your not allowed to delete'});
      }
    } else {
      res.json({success: false, msg: 'Company not found'});
    }
  });
});

router.get('/:companyid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Company.getCompanyById(req.params.companyid, (err, company) => {
    if (company) {
      if(req.user.role === 'superadmin' || company._id.toString() === req.user.companyid.toString()) {
        res.json({success: true, data: company});
      } else {
        res.json({success: false, msg: 'Your not allowed to delete'});
      }
    } else {
      res.json({success: false, msg: 'Company not found'});
    }
  });
});

module.exports = router;
