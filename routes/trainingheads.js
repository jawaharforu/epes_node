const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const Traininghead = require('../models/traininghead');

router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let fieldTraininghead = {
    name: req.body.name,
    companyid: req.user.companyid
  };

  if(req.body.trainingheadid) {
    Traininghead.updateTraininghead(req.body.trainingheadid, fieldTraininghead, (err, Traininghead) => {
      if(err) {
        res.json({success: false, msg: 'Failed to update Traininghead'});
      } else {
        res.json({success: true, msg: 'Traininghead Updated'});
      }
    });
  } else {
    Traininghead.addTraininghead(new Traininghead(fieldTraininghead), (err, Traininghead) => {
      if(err){
        res.json({success: false, msg: 'Failed to add Traininghead'});
      }else{
        res.json({success: true, msg: 'Traininghead Add', data: Traininghead});
      }
    });
  }

});

router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Traininghead.find({companyid: req.user.companyid})
  .then(traininghead => {
    res.json({success: true, data: traininghead});
  })
  .catch(err => console.log(err));
});


router.delete('/:trainingheadid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Traininghead.getTrainingheadById(req.params.trainingheadid, (err, traininghead) => {
    if (traininghead) {
      if(traininghead.companyid.toString() === req.user.companyid.toString()) {
        Traininghead.deleteTraininghead(req.params.trainingheadid, (err, result) => {
          if(err){
            res.json({success: false, msg: 'Failed to delete Traininghead'});
          }else{
            res.json({success: true, msg: 'Traininghead deleted successfully'});
          }
        });
      } else {
        res.json({success: false, msg: 'Your not allowed to delete'});
      }
    } else {
      res.json({success: false, msg: 'Traininghead not found'});
    }
  });
});
module.exports = router;
