const mongoose = require('mongoose');
const config = require('../config/database');
const Company = require('./company');
const Jd = require('./jd');
const Question = require('./question');

const JdquestionSchema = mongoose.Schema({
    jdid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jd',
        required: [true,'No JD id found']
    },
    questionid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: [true,'No Question id found']
    },
    companyid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true,'No Company id found']
    },
    createdon: {
        type: Date,
        default: Date.now
    },
    updatedon: {
        type: Date,
        default: Date.now
    }
});

const Jdquestion = module.exports = mongoose.model('Jdquestion', JdquestionSchema);

module.exports.addJdquestion = function(newJdquestion, callback){
    newJdquestion.save(callback);
};

module.exports.deleteJdquestion = function(jdquestionid, callback){
    Jdquestion.remove({questionid: jdquestionid}, callback);
};

module.exports.updateJdquestion = function(jdid, updateResult, callback){
    Jdquestion.update({jdid: jdid},updateResult, callback);
};

module.exports.getJdquestionById = function(jdquestionid, callback){
  Jdquestion.findById(jdquestionid, callback);
};

module.exports.getAssAndHeadByJD = function(jdid, callback) {
    Jdquestion.aggregate([
        {
            $match: {
              'jdid': mongoose.Types.ObjectId(jdid)
            }
        },
        {
            $lookup: {
                from: 'questions',
                localField: 'questionid',
                foreignField: '_id',
                as: 'question'
            }
        },
        { $group : { _id : "$question.assessmenttypeid", heads: { $push: { item: "$question.headerid" } } } },
        {
          $lookup: {
              from: 'assessmenttypes',
              localField: '_id',
              foreignField: '_id',
              as: 'assessmenttype'
          }
      },
      {
        $lookup: {
            from: 'headers',
            localField: 'heads.item',
            foreignField: '_id',
            as: 'header'
        }
    },
    ], callback);
};
