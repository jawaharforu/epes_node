const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const Globalsetting = require('../models/globalsetting');

router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let fieldGlobalsetting = {
    tolerance: req.body.tolerance,
    externalreference: req.body.externalreference,
    internalemployeereference: req.body.internalemployeereference,
    managingdirectorsdescretion: req.body.managingdirectorsdescretion,
    specialallowance: req.body.specialallowance,
    cim: req.body.cim,
    nocim: req.body.nocim,
    thirdpartyevaluation1: req.body.thirdpartyevaluation1,
    thirdpartyevaluation2: req.body.thirdpartyevaluation2,
    thirdpartyevaluation3: req.body.thirdpartyevaluation3,
    controlsworkingaquantance05: req.body.controlsworkingaquantance05,
    controlsworkingaquantance510: req.body.controlsworkingaquantance510,
    controlsworkingaquantance10: req.body.controlsworkingaquantance10,
    chairmansreference: req.body.chairmansreference,
    overworkingaquantance05: req.body.overworkingaquantance05,
    overworkingaquantance510: req.body.overworkingaquantance510,
    overworkingaquantance10: req.body.overworkingaquantance10,
    overpriorrelevant05: req.body.overpriorrelevant05,
    overpriorrelevant510: req.body.overpriorrelevant510,
    overpriorrelevant10: req.body.overpriorrelevant10,
    companyid: req.user.companyid
  };
  Globalsetting.findOne({companyid: req.user.companyid})
  .then(globalsettings => {
    if(globalsettings) {
      Globalsetting.updateGlobalsetting(globalsettings._id, fieldGlobalsetting, (err, globalsetting) => {
        if(err) {
          res.json({success: false, msg: 'Failed to update Globalsetting'});
        } else {
          res.json({success: true, msg: 'Globalsetting Updated'});
        }
      });
    } else {
      Globalsetting.addGlobalsetting(new Globalsetting(fieldGlobalsetting), (err, globalsetting) => {
        if(err){
          res.json({success: false, msg: 'Failed to add Globalsetting'});
        }else{
          res.json({success: true, msg: 'Globalsetting Add', data: globalsetting});
        }
      });
    }
  })
  .catch(err => console.log(err));
});

router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Globalsetting.find({companyid: req.user.companyid})
  .then(globalsetting => {
    res.json({success: true, data: globalsetting});
  })
  .catch(err => console.log(err));
});


router.delete('/:globalsettingid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Globalsetting.getGlobalsettingById(req.params.globalsettingid, (err, globalsetting) => {
    if (globalsetting) {
      if(globalsetting.companyid.toString() === req.user.companyid.toString()) {
        Globalsetting.deleteGlobalsetting(req.params.globalsettingid, (err, result) => {
          if(err){
            res.json({success: false, msg: 'Failed to delete Globalsetting'});
          }else{
            res.json({success: true, msg: 'Globalsetting deleted successfully'});
          }
        });
      } else {
        res.json({success: false, msg: 'Your not allowed to delete'});
      }
    } else {
      res.json({success: false, msg: 'Globalsetting not found'});
    }
  });
});
module.exports = router;
