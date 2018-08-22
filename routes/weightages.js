const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const Weightage = require('../models/Weightage');

router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let fieldWeightage = {
    jdid: req.body.jdid,
    weightage: req.body.weightage,
    companyid: req.user.companyid
  };

  Weightage.findOne({'jdid': req.body.jdid})
  .then(weightages => {
    if(weightages) {
      Weightage.updateWeightage(req.body.jdid, fieldWeightage, (err, weightage) => {
        if(err) {
          res.json({success: false, msg: 'Failed to update Weightage'});
        } else {
          res.json({success: true, msg: 'Weightage Updated'});
        }
      });
    } else {
      Weightage.addWeightage(new Weightage(fieldWeightage), (err, weightage) => {
        if(err){
          res.json({success: false, msg: 'Failed to add Weightage'});
        }else{
          res.json({success: true, msg: 'Weightage Add', data: weightage});
        }
      });
    }
  })
  .catch(err => console.log(err));

});

router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Weightage.find({companyid: req.user.companyid})
  .then(weightage => {
    res.json({success: true, data: weightage});
  })
  .catch(err => console.log(err));
});

router.get('/:weightageid', (req, res, next) => {
  Weightage.getWeightageById(req.params.weightageid, (err, weightage) => {
    if (weightage) {
      res.json({success: true, data: weightage});
    } else {
      res.json({success: false, msg: 'weightage not found'});
    }
  });
});

router.delete('/:weightageid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Weightage.getWeightageById(req.params.weightageid, (err, weightage) => {
    if (weightage) {
      if(weightage.companyid.toString() === req.user.companyid.toString()) {
        Weightage.deleteWeightage(req.params.weightageid, (err, result) => {
          if(err){
            res.json({success: false, msg: 'Failed to delete Weightage'});
          }else{
            res.json({success: true, msg: 'Weightage deleted successfully'});
          }
        });
      } else {
        res.json({success: false, msg: 'Your not allowed to delete'});
      }
    } else {
      res.json({success: false, msg: 'Weightage not found'});
    }
  });
});

router.get('/getbyjd/:jdid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Weightage.findOne({jdid: req.params.jdid})
  .then(weightage => {
    if (weightage) {
      res.json({success: true, data: weightage});
    } else {
      res.json({success: false, data: weightage});
    }
  })
  .catch(err => console.log(err));
});
module.exports = router;
