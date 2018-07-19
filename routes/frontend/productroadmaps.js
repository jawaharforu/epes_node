const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../../config/database');

const Productroadmap = require('../../models/frontend/productroadmap');

router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let fieldProductroadmap = {
      name: req.body.name,
      description: req.body.description,
      status: req.body.status,
      companyid: req.user.companyid
  };

  if(req.body.productroadmapid) {
    Productroadmap.updateProductroadmap(req.body.productroadmapid, fieldProductroadmap, (err, productroadmap) => {
      if(err) {
        res.json({success: false, msg: 'Failed to update Productroadmap'});
      } else {
        res.json({success: true, msg: 'Productroadmap Updated'});
      }
    });
  } else {
    Productroadmap.addProductroadmap(new Productroadmap(fieldProductroadmap), (err, productroadmap) => {
      if(err){
        res.json({success: false, msg: 'Failed to add Productroadmap'});
      }else{
          res.json({success: true, msg: 'Productroadmap Add', data: productroadmap});
      }
    });
  }
});

router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Productroadmap.find()
  .then(productroadmap => {
    res.json({success: true, data: productroadmap});
  })
  .catch(err => console.log(err));
});

router.delete('/:productroadmapid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Productroadmap.getProductroadmapById(req.params.productroadmapid, (err, productroadmap) => {
    if (productroadmap) {
      if(productroadmap.companyid.toString() === req.user.companyid.toString()) {
        Productroadmap.deleteProductroadmap(req.params.productroadmapid, (err, result) => {
          if(err){
            res.json({success: false, msg: 'Failed to delete Productroadmap'});
          }else{
            res.json({success: true, msg: 'Productroadmap deleted successfully'});
          }
        });
      } else {
        res.json({success: false, msg: 'Your not allowed to delete'});
      }
    } else {
      res.json({success: false, msg: 'Productroadmap not found'});
    }
  });
});

router.get('/:productroadmapid', (req, res, next) => {
  Productroadmap.getProductroadmapById(req.params.productroadmapid, (err, productroadmap) => {
    if (productroadmap) {
      res.json({success: true, data: productroadmap});
    } else {
      res.json({success: false, msg: 'Productroadmap not found'});
    }
  });
});

router.get('/get/list', (req, res) => {
  Productroadmap.find({status: true})
  .then(productroadmap => {
    res.json({success: true, data: productroadmap});
  })
  .catch(err => console.log(err));
});

module.exports = router;
