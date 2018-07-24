const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../../config/database');

const Career = require('../../models/frontend/career');

router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let fieldCareer = {
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
      status: req.body.status,
      companyid: req.user.companyid
  };

  if(req.body.careerid) {
    Career.updateCareer(req.body.careerid, fieldCareer, (err, career) => {
      if(err) {
        res.json({success: false, msg: 'Failed to update Career'});
      } else {
        res.json({success: true, msg: 'Career Updated'});
      }
    });
  } else {
    Career.addCareer(new Career(fieldCareer), (err, career) => {
      if(err){
        res.json({success: false, msg: 'Failed to add Career'});
      }else{
          res.json({success: true, msg: 'Career Add', data: career});
      }
    });
  }
});

router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Career.find()
  .then(career => {
    res.json({success: true, data: career});
  })
  .catch(err => console.log(err));
});

router.delete('/:careerid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Career.getCareerById(req.params.careerid, (err, career) => {
    if (career) {
      if(career.companyid.toString() === req.user.companyid.toString()) {
        Career.deleteCareer(req.params.careerid, (err, result) => {
          if(err){
            res.json({success: false, msg: 'Failed to delete Career'});
          }else{
            res.json({success: true, msg: 'Career deleted successfully'});
          }
        });
      } else {
        res.json({success: false, msg: 'Your not allowed to delete'});
      }
    } else {
      res.json({success: false, msg: 'Career not found'});
    }
  });
});

router.get('/:careerid', (req, res, next) => {
  Career.getCareerById(req.params.careerid, (err, career) => {
    if (career) {
      res.json({success: true, data: career});
    } else {
      res.json({success: false, msg: 'Career not found'});
    }
  });
});

router.get('/get/list', (req, res) => {
  Career.find({status: true})
  .then(career => {
    res.json({success: true, data: career});
  })
  .catch(err => console.log(err));
});

module.exports = router;
