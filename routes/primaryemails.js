const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const Primaryemail = require('../models/primaryemail');

router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let fieldPrimaryemail = {
    email: req.body.email,
    companyid: req.user.companyid
  };

  if(req.body.primaryemailid) {
    Primaryemail.updatePrimaryemail(req.body.primaryemailid, fieldPrimaryemail, (err, Primaryemail) => {
      if(err) {
        res.json({success: false, msg: 'Failed to update Primaryemail'});
      } else {
        res.json({success: true, msg: 'Primaryemail Updated'});
      }
    });
  } else {
    Primaryemail.addPrimaryemail(new Primaryemail(fieldPrimaryemail), (err, Primaryemail) => {
      if(err){
        res.json({success: false, msg: 'Failed to add Primaryemail'});
      }else{
        res.json({success: true, msg: 'Primaryemail Add', data: Primaryemail});
      }
    });
  }

});

router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Primaryemail.find({companyid: req.user.companyid})
  .then(Primaryemail => {
    res.json({success: true, data: Primaryemail});
  })
  .catch(err => console.log(err));
});


router.delete('/:primaryemailid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Primaryemail.getPrimaryemailById(req.params.primaryemailid, (err, primaryemail) => {
    if (primaryemail) {
      if(primaryemail.companyid.toString() === req.user.companyid.toString()) {
        Primaryemail.deletePrimaryemail(req.params.primaryemailid, (err, result) => {
          if(err){
            res.json({success: false, msg: 'Failed to delete Primaryemail'});
          }else{
            res.json({success: true, msg: 'Primaryemail deleted successfully'});
          }
        });
      } else {
        res.json({success: false, msg: 'Your not allowed to delete'});
      }
    } else {
      res.json({success: false, msg: 'Primaryemail not found'});
    }
  });
});
module.exports = router;
