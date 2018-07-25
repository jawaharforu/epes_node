const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../../config/database');

const Faqcategory = require('../../models/frontend/faqcategory');
const Faqsubcategory = require('../../models/frontend/faqsubcategory');

router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let fieldFaqcategory = {
      name: req.body.name,
      companyid: req.user.companyid
  };

  if(req.body.faqcategoryid) {
    Faqcategory.updateFaqcategory(req.body.faqcategoryid, fieldFaqcategory, (err, faqcategory) => {
      if(err) {
        res.json({success: false, msg: 'Failed to update Faq category'});
      } else {
        res.json({success: true, msg: 'Faq category Updated'});
      }
    });
  } else {
    Faqcategory.addFaqcategory(new Faqcategory(fieldFaqcategory), (err, faqcategory) => {
      if(err){
        res.json({success: false, msg: 'Failed to add Faq category'});
      }else{
          res.json({success: true, msg: 'Faq category Add', data: faqcategory});
      }
    });
  }

});

router.get('/', (req, res, next) => {
  Faqcategory.find()
  .then(faqcategory => {
    res.json({success: true, data: faqcategory});
  })
  .catch(err => console.log(err));
});

router.delete('/:faqcategoryid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Faqcategory.getFaqcategoryById(req.params.faqcategoryid, (err, faqcategory) => {
    if (faqcategory) {
      if(faqcategory.companyid.toString() === req.user.companyid.toString()) {
        Faqcategory.deleteFaqcategory(req.params.faqcategoryid, (err, result) => {
          if(err){
            res.json({success: false, msg: 'Failed to delete Faq category'});
          }else{
            res.json({success: true, msg: 'Faq category deleted successfully'});
          }
        });
      } else {
        res.json({success: false, msg: 'Your not allowed to delete'});
      }
    } else {
      res.json({success: false, msg: 'Faq category not found'});
    }
  });
});

router.get('/get/sub', (req, res, next) => {
  Faqcategory.find()
  .then(faqcategory => {
    var f = [];
    var i = 1;
    faqcategory.forEach(element => {
      Faqsubcategory.find({faqcategoryid: element._id})
      .then(faqsubcategory => {
        if (faqsubcategory) {
          f[element._id] = faqsubcategory;
        }
        if(i === faqcategory.length) {
          console.log(f);
          res.json({success: true, data: f});
        }
        i++;
      })
      .catch(err => console.log(err));
    });
  })
  .catch(err => console.log(err));
});

module.exports = router;
