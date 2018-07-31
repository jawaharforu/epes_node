const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const Budgetplan = require('../models/budgetplan');

router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let fieldBudgetplan = {
      assessmenttypeid: req.body.assessmenttypeid,
      headerid: req.body.headerid,
      trainingheadid: req.body.trainingheadid,
      trainingsubheadid: req.body.trainingsubheadid,
      budgetid: req.body.budgetid,
      percentage: req.body.percentage,
      companyid: req.user.companyid
  };

  if(req.body.budgetplanid) {
    Budgetplan.updateBudgetplan(req.body.budgetplanid, fieldBudgetplan, (err, budgetplan) => {
      if(err) {
        res.json({success: false, msg: 'Failed to update Budgetplan'});
      } else {
        res.json({success: true, msg: 'Budgetplan Updated'});
      }
    });
  } else {
    Budgetplan.addBudgetplan(new Budgetplan(fieldBudgetplan), (err, budgetplan) => {
      if(err){
        res.json({success: false, msg: 'Failed to add Budgetplan'});
      }else{
        res.json({success: true, msg: 'Budgetplan Add', data: budgetplan});
      }
    });
  }

});

router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Budgetplan.find()
  .populate('trainingheadid')
  .then(Budgetplan => {
    res.json({success: true, data: Budgetplan});
  })
  .catch(err => console.log(err));
});

router.delete('/:budgetplanid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Budgetplan.getBudgetplanById(req.params.budgetplanid, (err, budgetplan) => {
    if (budgetplan) {
      if(budgetplan.companyid.toString() === req.user.companyid.toString()) {
        Budgetplan.deleteBudgetplan(req.params.budgetplanid, (err, result) => {
          if(err){
            res.json({success: false, msg: 'Failed to delete Budgetplan'});
          }else{
            res.json({success: true, msg: 'Budgetplan deleted successfully'});
          }
        });
      } else {
        res.json({success: false, msg: 'Your not allowed to delete'});
      }
    } else {
      res.json({success: false, msg: 'Budgetplan not found'});
    }
  });
});

router.get('/list/:budgetid', (req, res, next) => {
  Budgetplan.find({budgetid: req.params.budgetid})
  .populate('budgetid')
  .then(budgetplan => {
    res.json({success: true, data: budgetplan});
  })
  .catch(err => console.log(err));
});

module.exports = router;
