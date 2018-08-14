const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const Jdquestion = require('../models/jdquestion');
const Question = require('../models/question');
const mongoose = require('mongoose');

router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let fieldJdquestion = {
    jdid: req.body.jdid,
    questionid: req.body.questionid,
    companyid: req.user.companyid
  };
  Jdquestion.findOne({ $and: [{'jdid': req.body.jdid},{'questionid' : req.body.questionid}] })
  .then(jdquestion => {
    if(jdquestion) {
      Jdquestion.updateJdquestion(jdquestion._id, fieldJdquestion, (err, jdquestion) => {
        if(err) {
          res.json({success: false, msg: 'Failed to update Jdquestion'});
        } else {
          res.json({success: true, msg: 'Jdquestion Updated'});
        }
      });
    } else {
      Jdquestion.addJdquestion(new Jdquestion(fieldJdquestion), (err, jdquestion) => {
        if(err){
          res.json({success: false, msg: 'Failed to add Jdquestion'});
        }else{
          res.json({success: true, msg: 'Jdquestion Add', data: jdquestion});
        }
      });
    }
  })
  .catch(err => console.log(err));
});

router.get('/list', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Jdquestion.find({companyid: req.user.companyid})
  .then(jdquestion => {
    res.json({success: true, data: jdquestion});
  })
  .catch(err => console.log(err));
});

router.delete('/:jdquestionid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  var split = req.params.jdquestionid.split("::");
  Jdquestion.remove({ $and: [{'jdid': split[0]},{'questionid' : split[1]}] })
  .then(jdquestion => {
    if (jdquestion) {
      res.json({success: true, msg: 'Question removed successfully'});
    } else {
      res.json({success: false, msg: 'Failed to removed Organogram'});
    }
  })
  .catch(err => console.log(err));
});

router.get('/check/:jdid/:questionid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Jdquestion.findOne({ $and: [{'jdid': req.body.jdid},{'questionid' : req.body.questionid}] })
  .then(jdquestion => {
    if (jdquestion) {
      res.json({success: true, data: jdquestion});
    } else {
      res.json({success: false, data: jdquestion});
    }
  })
  .catch(err => console.log(err));
});

router.get('/getbyjd/:jdid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Jdquestion.find({jdid: req.params.jdid})
  .then(jdquestion => {
    res.json({success: true, data: jdquestion});
  })
  .catch(err => console.log(err));
});

router.get('/getbyjdwithqu/:jdid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Jdquestion.find({jdid: req.params.jdid})
  .populate({path: 'questionid', populate: [{path: 'scaleid'},{path: 'assessmenttypeid'},{path: 'headerid'}]})
  .then(jdquestion => {
    res.json({success: true, data: jdquestion});
  })
  .catch(err => console.log(err));
});

router.get('/fetchassessandheadbyjd/:jdid', passport.authenticate('jwt', { session: false }), (req, res, next) => {

  Jdquestion.find({jdid: req.params.jdid})
  .then(jdquestion => {
    Question.find({
      "_id" : {
        "$in" : jdquestion.map(item => {
          return mongoose.Types.ObjectId(item.questionid);
        })
       }
    })
    .populate('assessmenttypeid')
    .populate('headerid')
    .then(question => {
      res.json({success: true, data: question});
    })
    .catch(err => console.log(err));
  })
  .catch(err => console.log(err));

});

router.get('/assessandhead/:jdid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Jdquestion.getAssAndHeadByJD(req.params.jdid, (err, jdquestion) => {
      if(err) throw err;
      res.json({success: true, data: jdquestion});
  });
});

module.exports = router;
