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
      compnayname: req.body.compnayname,
      industry: req.body.industry,
      noofemployees: req.body.noofemployees,
      companycontact: req.body.companycontact,
      companyaddress: req.body.companyaddress,
      country: req.body.country,
      state: req.body.state,
      city: req.body.city,
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

module.exports = router;
