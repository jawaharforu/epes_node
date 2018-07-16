const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../../config/database');

const Feature = require('../../models/frontend/feature');

router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let fieldFeature = {
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
      status: req.body.status,
      companyid: req.user.companyid
  };

  if(req.body.featureid) {
    Feature.updateFeature(req.body.featureid, fieldFeature, (err, feature) => {
      if(err) {
        res.json({success: false, msg: 'Failed to update Feature'});
      } else {
        res.json({success: true, msg: 'Feature Updated'});
      }
    });
  } else {
    Feature.addFeature(new Feature(fieldFeature), (err, feature) => {
      if(err){
        res.json({success: false, msg: 'Failed to add Feature'});
      }else{
          res.json({success: true, msg: 'Feature Add', data: feature});
      }
    });
  }
});

router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Feature.find()
  .then(feature => {
    res.json({success: true, data: feature});
  })
  .catch(err => console.log(err));
});

router.delete('/:featureid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Feature.gerFeatureById(req.params.featureid, (err, feature) => {
    if (feature) {
      if(feature.companyid.toString() === req.user.companyid.toString()) {
        Feature.deleteFeature(req.params.featureid, (err, result) => {
          if(err){
            res.json({success: false, msg: 'Failed to delete Feature'});
          }else{
            res.json({success: true, msg: 'Feature deleted successfully'});
          }
        });
      } else {
        res.json({success: false, msg: 'Your not allowed to delete'});
      }
    } else {
      res.json({success: false, msg: 'Feature not found'});
    }
  });
});

router.get('/:featureid', (req, res, next) => {
  Feature.gerFeatureById(req.params.featureid, (err, feature) => {
    if (feature) {
      res.json({success: true, data: feature});
    } else {
      res.json({success: false, msg: 'Feature not found'});
    }
  });
});

router.get('/get/list', (req, res) => {
  Feature.find({status: true})
  .then(feature => {
    res.json({success: true, data: feature});
  })
  .catch(err => console.log(err));
});

module.exports = router;
