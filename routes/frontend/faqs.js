const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../../config/database');

const Faq = require('../../models/frontend/faq');

router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let fieldFaq = {
      faqcategoryid: req.body.faqcategoryid,
      question: req.body.question,
      answer: req.body.answer,
      companyid: req.user.companyid,
      role: req.user.role
  };

  if(req.body.faqid) {
    Faq.updateFaq(req.body.faqid, fieldFaq, (err, Faq) => {
      if(err) {
        res.json({success: false, msg: 'Failed to update Faq'});
      } else {
        res.json({success: true, msg: 'Faq Updated'});
      }
    });
  } else {
    Faq.addFaq(new Faq(fieldFaq), (err, Faq) => {
      if(err){
        res.json({success: false, msg: 'Failed to add Faq'});
      }else{
          res.json({success: true, msg: 'Faq Add', data: Faq});
      }
    });
  }
});

router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Faq.find().populate('faqcategoryid', ['name'])
  .then(Faq => {
    res.json({success: true, data: Faq});
  })
  .catch(err => console.log(err));
});

router.delete('/:faqid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Faq.getFaqById(req.params.faqid, (err, faq) => {
    if (faq) {
      if(faq.companyid.toString() === req.user.companyid.toString()) {
        Faq.deleteFaq(req.params.faqid, (err, result) => {
          if(err){
            res.json({success: false, msg: 'Failed to delete Faq'});
          }else{
            res.json({success: true, msg: 'Faq deleted successfully'});
          }
        });
      } else {
        res.json({success: false, msg: 'Your not allowed to delete'});
      }
    } else {
      res.json({success: false, msg: 'Faq not found'});
    }
  });
});

router.get('/:faqid', (req, res, next) => {
  Faq.gerFaqById(req.params.faqid, (err, Faq) => {
    if (Faq) {
      res.json({success: true, data: Faq});
    } else {
      res.json({success: false, msg: 'Faq not found'});
    }
  });
});

router.get('/category/:faqcategoryid', (req, res) => {
  Faq.getAllFaqsByCategory(req.params.faqcategoryid, (err, Faq) => {
    if (Faq) {
      res.json({success: true, data: Faq});
    } else {
      res.json({success: false, msg: 'Faq not found'});
    }
  });
});

module.exports = router;
