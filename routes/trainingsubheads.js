const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const Trainingsubhead = require('../models/trainingsubhead');

router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let fieldTrainingsubhead = {
      name: req.body.name,
      trainingheadid: req.body.trainingheadid,
      companyid: req.user.companyid
  };

  if(req.body.trainingsubheadid) {
    Trainingsubhead.updateTrainingsubhead(req.body.trainingsubheadid, fieldTrainingsubhead, (err, subdepatment) => {
      if(err) {
        res.json({success: false, msg: 'Failed to update Trainingsubhead'});
      } else {
        res.json({success: true, msg: 'Trainingsubhead Updated'});
      }
    });
  } else {
    Trainingsubhead.addTrainingsubhead(new Trainingsubhead(fieldTrainingsubhead), (err, Trainingsubhead) => {
      if(err){
        res.json({success: false, msg: 'Failed to add Trainingsubhead'});
      }else{
          res.json({success: true, msg: 'Trainingsubhead Add', data: Trainingsubhead});
      }
    });
  }

});

router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Trainingsubhead.find()
  .populate('trainingheadid')
  .then(trainingsubhead => {
    res.json({success: true, data: trainingsubhead});
  })
  .catch(err => console.log(err));
});

router.delete('/:trainingsubheadid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Trainingsubhead.getTrainingsubheadById(req.params.trainingsubheadid, (err, Trainingsubhead) => {
    if (trainingsubhead) {
      if(trainingsubhead.companyid.toString() === req.user.companyid.toString()) {
        Trainingsubhead.deleteTrainingsubhead(req.params.trainingsubheadid, (err, result) => {
          if(err){
            res.json({success: false, msg: 'Failed to delete Trainingsubhead'});
          }else{
            res.json({success: true, msg: 'Trainingsubhead deleted successfully'});
          }
        });
      } else {
        res.json({success: false, msg: 'Your not allowed to delete'});
      }
    } else {
      res.json({success: false, msg: 'Trainingsubhead not found'});
    }
  });
});

router.get('/list/:trainingheadid', (req, res, next) => {
  Trainingsubhead.find({trainingheadid: req.params.trainingheadid})
  .populate('trainingheadid')
  .then(trainingsubhead => {
    res.json({success: true, data: trainingsubhead});
  })
  .catch(err => console.log(err));
});

module.exports = router;
