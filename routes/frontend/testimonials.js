const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../../config/database');

const Testimonial = require('../../models/frontend/testimonial');

router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let fieldTestimonial = {
      name: req.body.name,
      description: req.body.description,
      image: req.body.image,
      status: req.body.status,
      companyid: req.user.companyid
  };

  if(req.body.testimonialid) {
    Testimonial.updateTestimonial(req.body.testimonialid, fieldTestimonial, (err, testimonial) => {
      if(err) {
        res.json({success: false, msg: 'Failed to update Testimonial'});
      } else {
        res.json({success: true, msg: 'Testimonial Updated'});
      }
    });
  } else {
    Testimonial.addTestimonial(new Testimonial(fieldTestimonial), (err, testimonial) => {
      if(err){
        res.json({success: false, msg: 'Failed to add Testimonial'});
      }else{
          res.json({success: true, msg: 'Testimonial Add', data: testimonial});
      }
    });
  }

});

router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Testimonial.find()
  .then(testimonial => {
    res.json({success: true, data: testimonial});
  })
  .catch(err => console.log(err));
});

router.delete('/:testimonialid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Testimonial.gerTestimonialById(req.params.testimonialid, (err, testimonial) => {
    if (testimonial) {
      if(testimonial.companyid.toString() === req.user.companyid.toString()) {
        Testimonial.deleteTestimonial(req.params.testimonialid, (err, result) => {
          if(err){
            res.json({success: false, msg: 'Failed to delete Testimonial'});
          }else{
            res.json({success: true, msg: 'Testimonial deleted successfully'});
          }
        });
      } else {
        res.json({success: false, msg: 'Your not allowed to delete'});
      }
    } else {
      res.json({success: false, msg: 'Testimonial not found'});
    }
  });
});

router.get('/:testimonialid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Testimonial.gerTestimonialById(req.params.testimonialid, (err, testimonial) => {
    if (testimonial) {
      res.json({success: true, data: testimonial});
    } else {
      res.json({success: false, msg: 'Testimonial not found'});
    }
  });
});

router.get('/get/list', (req, res) => {
  Testimonial.find({status: true})
  .then(testimonial => {
    res.json({success: true, data: testimonial});
  })
  .catch(err => console.log(err));
});

module.exports = router;
