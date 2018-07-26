const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const Organogram = require('../models/organogram');
// var autoIncrement = require("mongodb-autoincrement");

router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let fieldOrganogram = {
    name: req.body.name,
    departmentid: req.body.departmentid,
    subdepartmentid: req.body.subdepartmentid,
    designation: req.body.designation,
    parentid: req.body.parentid,
    uniqueid: (req.body.uniqueid === undefined || req.body.uniqueid === '') ? 1 : req.body.uniqueid,
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
    Organogram.findOne().sort({'createdon': -1})
    .then(organogram => {
      if (organogram) {
        fieldOrganogram.uniqueid = (organogram.uniqueid === undefined || organogram.uniqueid === '') ? 1 : (organogram.uniqueid + 1);
      } else {
        fieldOrganogram.uniqueid = 1;
      }
      Organogram.addOrganogram(new Organogram(fieldOrganogram), (err, organogram) => {
        if(err){
          res.json({success: false, msg: 'Failed to add Organogram'});
        }else{
          res.json({success: true, msg: 'Organogram Add', data: organogram});
        }
      });
    })
    .catch(err => console.log(err));
  }

});

router.get('/:organogramid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  if(req.params.organogramid === 0) {
    var parent = 0;
  } else {
    var parent = req.params.organogramid.toString();
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
            Organogram.remove({$and:[{"companyid":req.user.companyid},{"parentid":organogram.uniqueid}]});
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

router.get('/getchild/:uniqueid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Organogram.find({parentid: req.params.uniqueid})
  .then(organogram => {
    res.json({success: true, data: organogram});
  })
  .catch(err => console.log(err));
});

router.get('/getfull/list', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Organogram.find({companyid: req.user.companyid})
  .then(organogram => {
    var t = [];
    var ids = [];
    for (var i = 0; i < organogram.length; i++) {
        t[organogram[i].uniqueid] = organogram[i].parentid;
        ids[organogram[i].uniqueid] = organogram[i];
        if (i === (organogram.length - 1)) {
          res.json({success: true, data: func(t, 0, ids)});
        }
    }
  })
  .catch(err => console.log(err));
});

function func(t, c, ids) {
  // https://stackoverflow.com/questions/36810428/building-multi-level-menu-using-nodejs
  var a = [];
  for (var i = 0; i < t.length; i++) {
      if (t[i] === c) {
          a.push({
              name: ids[i].name,
              designation: ids[i].designation,
              subordinates: func(t, i, ids)
          });
      }
  }
  return a;
}

module.exports = router;
