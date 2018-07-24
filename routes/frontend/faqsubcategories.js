const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../../config/database');

const Faqsubcategory = require('../../models/frontend/faqsubcategory');

router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let fieldFaqsubcategory = {
      name: req.body.name,
      faqcategoryid: req.body.faqcategoryid,
      companyid: req.user.companyid
  };

  if(req.body.faqsubcategoryid) {
    Faqsubcategory.updateFaqsubcategory(req.body.faqsubcategoryid, fieldFaqsubcategory, (err, faqsubcategory) => {
      if(err) {
        res.json({success: false, msg: 'Failed to update Faq sub category'});
      } else {
        res.json({success: true, msg: 'Faq sub category Updated'});
      }
    });
  } else {
    Faqsubcategory.addFaqsubcategory(new Faqsubcategory(fieldFaqsubcategory), (err, faqsubcategory) => {
      if(err){
        res.json({success: false, msg: 'Failed to add Faq sub category'});
      }else{
          res.json({success: true, msg: 'Faq sub category Add', data: faqsubcategory});
      }
    });
  }

});

router.get('/', (req, res, next) => {
  Faqsubcategory.find()
  .populate('faqcategoryid')
  .then(faqsubcategory => {
    res.json({success: true, data: faqsubcategory});
  })
  .catch(err => console.log(err));
});

router.delete('/:faqsubcategoryid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Faqsubcategory.gerFaqcategoryById(req.params.faqsubcategoryid, (err, faqsubcategory) => {
    if (faqsubcategory) {
      if(faqsubcategory.companyid.toString() === req.user.companyid.toString()) {
        Faqsubcategory.deleteFaqsubcategory(req.params.faqsubcategoryid, (err, result) => {
          if(err){
            res.json({success: false, msg: 'Failed to delete Faq sub category'});
          }else{
            res.json({success: true, msg: 'Faq sub category deleted successfully'});
          }
        });
      } else {
        res.json({success: false, msg: 'Your not allowed to delete'});
      }
    } else {
      res.json({success: false, msg: 'Faq sub category not found'});
    }
  });
});

router.get('/list/:faqcategoryid', (req, res, next) => {
  Faqsubcategory.find({faqcategoryid: req.params.faqcategoryid})
  .populate('faqcategoryid')
  .then(faqsubcategory => {
    res.json({success: true, data: faqsubcategory});
  })
  .catch(err => console.log(err));
});

module.exports = router;
