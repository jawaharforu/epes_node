const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const Subscription = require('../models/subscription');

router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let fieldSubscription = {
    productid: req.body.productid,
    extraemployees: req.body.extraemployees,
    companyid: req.user.companyid
  };

  if(req.body.subscriptionid) {
    Subscription.updateSubscription(req.body.subscriptionid, fieldSubscription, (err, subscription) => {
      if(err) {
        res.json({success: false, msg: 'Failed to update Subscription'});
      } else {
        res.json({success: true, msg: 'Subscription Updated'});
      }
    });
  } else {
    Subscription.addSubscription(new Subscription(fieldSubscription), (err, subscription) => {
      if(err){
        res.json({success: false, msg: 'Failed to add Subscription'});
      }else{
        res.json({success: true, msg: 'Subscription Add', data: subscription});
      }
    });
  }

});

router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Subscription.find({companyid: req.user.companyid})
  .then(subscription => {
    res.json({success: true, data: subscription});
  })
  .catch(err => console.log(err));
});

router.get('/:subscriptionid', (req, res, next) => {
  Subscription.getSubscriptionById(req.params.subscriptionid, (err, subscription) => {
    if (subscription) {
      res.json({success: true, data: subscription});
    } else {
      res.json({success: false, msg: 'Subscription not found'});
    }
  });
});

router.delete('/:subscriptionid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Subscription.getSubscriptionById(req.params.subscriptionid, (err, subscription) => {
    if (subscription) {
      if(subscription.companyid.toString() === req.user.companyid.toString()) {
        Subscription.deleteSubscription(req.params.subscriptionid, (err, result) => {
          if(err){
            res.json({success: false, msg: 'Failed to delete Subscription'});
          }else{
            res.json({success: true, msg: 'Subscription deleted successfully'});
          }
        });
      } else {
        res.json({success: false, msg: 'Your not allowed to delete'});
      }
    } else {
      res.json({success: false, msg: 'Subscription not found'});
    }
  });
});
module.exports = router;
