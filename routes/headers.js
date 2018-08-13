const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const Header = require('../models/header');

router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let fieldHeader = {
    assessmenttypeid: req.body.assessmenttypeid,
    headername: req.body.headername,
    description: req.body.description,
    companyid: req.user.companyid,
    role: req.user.role
  };

  if(req.body.headerid) {
    Header.updateHeader(req.body.headerid, fieldHeader, (err, header) => {
      if(err) {
        res.json({success: false, msg: 'Failed to update Header'});
      } else {
        res.json({success: true, msg: 'Header Updated'});
      }
    });
  } else {
    Header.addHeader(new Header(fieldHeader), (err, header) => {
      if(err){
        res.json({success: false, msg: 'Failed to add Header'});
      }else{
        res.json({success: true, msg: 'Header Add', data: header});
      }
    });
  }

});

router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Header.find({companyid: req.user.companyid})
  .populate('assessmenttypeid')
  .then(header => {
    res.json({success: true, data: header});
  })
  .catch(err => console.log(err));
});

router.get('/getlist', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Header.find({ $or: [{'companyid': req.user.companyid},{'role' : 'superadmin'}] })
  .populate('assessmenttypeid')
  .then(header => {
    res.json({success: true, data: header});
  })
  .catch(err => console.log(err));
});

router.delete('/:headerid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Header.getHeaderById(req.params.headerid, (err, header) => {
    if (header) {
      if(header.companyid.toString() === req.user.companyid.toString()) {
        Header.deleteHeader(req.params.headerid, (err, result) => {
          if(err){
            res.json({success: false, msg: 'Failed to delete Header'});
          }else{
            res.json({success: true, msg: 'Header deleted successfully'});
          }
        });
      } else {
        res.json({success: false, msg: 'Your not allowed to delete'});
      }
    } else {
      res.json({success: false, msg: 'Header not found'});
    }
  });
});

router.get('/list/:assessmenttypeid', (req, res, next) => {
  Header.find({assessmenttypeid: req.params.assessmenttypeid})
  .populate('assessmenttypeid')
  .then(header => {
    res.json({success: true, data: header});
  })
  .catch(err => console.log(err));
});
module.exports = router;
