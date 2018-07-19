const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const Organogram = require('../models/Organogram');

router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let fieldOrganogram = {
    name: req.body.name,
    department: req.body.department,
    designation: req.body.designation,
    parentid: req.body.parentid,
    companyid: req.user.companyid
  };
  if(req.body.organogramid) {
    Organogram.updateOrganogram(req.body.organogramid, fieldOrganogram, (err, organogram) => {
      if(err) {
        res.json({success: false, msg: 'Failed to update Organogram'});
      } else {
        res.json({success: true, msg: 'Organogram Updated'});
      }
    });
  } else {
    Organogram.addOrganogram(new Organogram(fieldOrganogram), (err, organogram) => {
      if(err){
        res.json({success: false, msg: 'Failed to add Organogram'});
      }else{
        res.json({success: true, msg: 'Organogram Add', data: organogram});
      }
    });
  }

});

router.get('/:organogramid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  if(req.params.organogramid === 'parent') {
    var parent = null;
  } else {
    var parent = req.params.organogramid;
  }
  Organogram.find({$and:[{"companyid":req.user.companyid},{"parentid":parent}]})
  .then(organogram => {
    res.json({success: true, data: organogram});
  })
  .catch(err => console.log(err));
});

router.get('/get/:organogramid', (req, res, next) => {
  Organogram.getOrganogramById(req.params.organogramid, (err, organogram) => {
    if (organogram) {
      res.json({success: true, data: organogram});
    } else {
      res.json({success: false, msg: 'Organogram not found'});
    }
  });
});

router.delete('/:organogramid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Organogram.getOrganogramById(req.params.organogramid, (err, organogram) => {
    if (organogram) {
      if(organogram.companyid.toString() === req.user.companyid.toString()) {
        Organogram.deleteOrganogram(req.params.organogramid, (err, result) => {
          if(err){
            res.json({success: false, msg: 'Failed to delete Organogram'});
          }else{
            Organogram.remove({parentid: req.params.organogramid});
            res.json({success: true, msg: 'Organogram deleted successfully'});
          }
        });
      } else {
        res.json({success: false, msg: 'Your not allowed to delete'});
      }
    } else {
      res.json({success: false, msg: 'Organogram not found'});
    }
  });
});

router.get('/getchild/:organogramid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Organogram.find({parentid: req.params.organogramid})
  .then(organogram => {
    res.json({success: true, data: organogram});
  })
  .catch(err => console.log(err));
});

router.get('/getlist', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Organogram.find({companyid: req.user.companyid})
  .then(organogram => {
    res.json({success: true, data: organogram});
  })
  .catch(err => console.log(err));
});

module.exports = router;
