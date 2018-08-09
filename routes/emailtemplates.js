const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const Emailtemplate = require('../models/emailtemplate');

router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let fieldEmailtemplate = {
    name: req.body.name,
    description: req.body.description,
    companyid: req.user.companyid
  };

  if(req.body.emailtemplateid) {
    Emailtemplate.updateEmailtemplate(req.body.emailtemplateid, fieldEmailtemplate, (err, emailtemplate) => {
      if(err) {
        res.json({success: false, msg: 'Failed to update Emailtemplate'});
      } else {
        res.json({success: true, msg: 'Emailtemplate Updated'});
      }
    });
  } else {
    Emailtemplate.addEmailtemplate(new Emailtemplate(fieldEmailtemplate), (err, emailtemplate) => {
      if(err){
        res.json({success: false, msg: 'Failed to add Emailtemplate'});
      }else{
        res.json({success: true, msg: 'Emailtemplate Add', data: emailtemplate});
      }
    });
  }

});

router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Emailtemplate.find({companyid: req.user.companyid})
  .then(emailtemplate => {
    res.json({success: true, data: emailtemplate});
  })
  .catch(err => console.log(err));
});

router.get('/:emailtemplateid', (req, res, next) => {
  Emailtemplate.getEmailtemplateById(req.params.emailtemplateid, (err, emailtemplate) => {
    if (emailtemplate) {
      res.json({success: true, data: emailtemplate});
    } else {
      res.json({success: false, msg: 'Emailtemplate not found'});
    }
  });
});

router.delete('/:emailtemplateid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Emailtemplate.getEmailtemplateById(req.params.emailtemplateid, (err, emailtemplate) => {
    if (emailtemplate) {
      if(emailtemplate.companyid.toString() === req.user.companyid.toString()) {
        Emailtemplate.deleteEmailtemplate(req.params.emailtemplateid, (err, result) => {
          if(err){
            res.json({success: false, msg: 'Failed to delete Emailtemplate'});
          }else{
            res.json({success: true, msg: 'Emailtemplate deleted successfully'});
          }
        });
      } else {
        res.json({success: false, msg: 'Your not allowed to delete'});
      }
    } else {
      res.json({success: false, msg: 'Emailtemplate not found'});
    }
  });
});
module.exports = router;
