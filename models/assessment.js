const mongoose = require('mongoose');
const config = require('../config/database');
const Company = require('./company');

const AssessmentSchema = mongoose.Schema({
    title: {
        type: String
    },
    type: {
        type: String
    },
    periodoftime: {
        type: String
    },
    duration: {
        type: String
    },
    duedate: {
        type: Date
    },
    description: {
        type: String
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

const Assessment = module.exports = mongoose.model('Assessment', AssessmentSchema);

module.exports.addAssessment = function(newAssessment, callback){
    newAssessment.save(callback);
};

module.exports.deleteAssessment = function(assessmentid, callback){
    Assessment.remove({_id: assessmentid}, callback);
};

module.exports.updateAssessment = function(assessmentid, updateResult, callback){
    Assessment.update({_id: assessmentid},updateResult, callback);
};

module.exports.getAssessmentById = function(assessmentid, callback){
  Assessment.findById(assessmentid, callback);
};
