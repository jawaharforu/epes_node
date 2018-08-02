const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const Budget = require('../models/budget');

router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let fieldBudget = {
    year: req.body.year,
    amount: req.body.amount,
    companyid: req.user.companyid
  };

  if(req.body.budgetid) {
    Budget.updateBudget(req.body.budgetid, fieldBudget, (err, Budget) => {
      if(err) {
        res.json({success: false, msg: 'Failed to update Budget'});
      } else {
        res.json({success: true, msg: 'Budget Updated'});
      }
    });
  } else {
    Budget.addBudget(new Budget(fieldBudget), (err, budget) => {
      if(err){
        res.json({success: false, msg: 'Failed to add Budget'});
      }else{
        res.json({success: true, msg: 'Budget Add', data: budget});
      }
    });
  }

});

router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Budget.find({companyid: req.user.companyid})
  .then(budget => {
    res.json({success: true, data: budget});
  })
  .catch(err => console.log(err));
});

router.get('/:budgetid', (req, res, next) => {
  Faq.getBudgetById(req.params.budgetid, (err, budget) => {
    if (budget) {
      res.json({success: true, data: budget});
    } else {
      res.json({success: false, msg: 'Faq not found'});
    }
  });
});

router.delete('/:budgetid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Budget.getBudgetById(req.params.budgetid, (err, budget) => {
    if (budget) {
      if(budget.companyid.toString() === req.user.companyid.toString()) {
        Budget.deleteBudget(req.params.budgetid, (err, result) => {
          if(err){
            res.json({success: false, msg: 'Failed to delete Budget'});
          }else{
            res.json({success: true, msg: 'Budget deleted successfully'});
          }
        });
      } else {
        res.json({success: false, msg: 'Your not allowed to delete'});
      }
    } else {
      res.json({success: false, msg: 'Budget not found'});
    }
  });
});
module.exports = router;
