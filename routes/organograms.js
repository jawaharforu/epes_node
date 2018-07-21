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
    var parent = "parent";
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
  Organogram.find({parentid: req.params.organogramid.toString()})
  .then(organogram => {
    res.json({success: true, data: organogram});
  })
  .catch(err => console.log(err));
});

router.get('/getfull/list', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  var nodes = [
    { id: 1, parent: 'parent' },
    { id: 2, parent: 'parent' },
    { id: 3, parent: 1 },
    { id: 4, parent: 1 },
    { id: 5, parent: 2 },
    { id: 6, parent: 2 },
    { id: 7, parent: 2 },
    { id: 30, parent: 3 },
    { id: 31, parent: 3 },
    { id: 70, parent: 7 },
    { id: 71, parent: 7 }
  ];
  var t = [];
  for (var i = 0; i < nodes.length; i++) {
    t[nodes[i].id] = nodes[i].parent;
  }
  console.log(t);
  res.json(func(t, 'parent'));
});

function func(t, c) {
  // https://stackoverflow.com/questions/36810428/building-multi-level-menu-using-nodejs
  var a = [];
  for (var i = 0; i < t.length; i++) {
      if (t[i] === c) {
          a.push({
              id: i,
              sub: func(t, i)
          });
      }
  }
  return a;
}
module.exports = router;
