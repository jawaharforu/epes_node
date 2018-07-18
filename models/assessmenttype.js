const mongoose = require('mongoose');
const config = require('../config/database');
const Company = require('./company');

const AssessmenttypeSchema = mongoose.Schema({
    name: {
        type: String
    },
    role: {
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

const Assessmenttype = module.exports = mongoose.model('Assessmenttype', AssessmenttypeSchema);

module.exports.addAssessmenttype = function(newAssessmenttype, callback){
    newAssessmenttype.save(callback);
};

module.exports.deleteAssessmenttype = function(assessmenttypeid, callback){
    Assessmenttype.remove({_id: assessmenttypeid}, callback);
};

module.exports.updateAssessmenttype = function(assessmenttypeid, updateResult, callback){
    Assessmenttype.update({_id: assessmenttypeid},updateResult, callback);
};

module.exports.getAssessmenttypeById = function(assessmenttypeid, callback){
  Assessmenttype.findById(assessmenttypeid, callback);
};
