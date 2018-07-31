const mongoose = require('mongoose');
const config = require('../config/database');
const Company = require('./company');

const AppraisalSchema = mongoose.Schema({
    seniormanagerfixed: {
        type: Number
    },
    seniormanagervariable: {
        type: Number
    },
    seniormanagerbonus: {
        type: Number
    },
    managerfixed: {
        type: Number
    },
    managervariable: {
        type: Number
    },
    managerbonus: {
        type: Number
    },
    executivesfixed: {
        type: Number
    },
    executivesvariable: {
        type: Number
    },
    executivesbonus: {
        type: Number
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

const Appraisal = module.exports = mongoose.model('Appraisal', AppraisalSchema);

module.exports.addAppraisal = function(newAppraisal, callback){
    newAppraisal.save(callback);
};

module.exports.deleteAppraisal = function(Appraisalid, callback){
    Appraisal.remove({_id: Appraisalid}, callback);
};

module.exports.updateAppraisal = function(Appraisalid, updateResult, callback){
    Appraisal.update({_id: Appraisalid},updateResult, callback);
};

module.exports.getAppraisalById = function(Appraisalid, callback){
  Appraisal.findById(Appraisalid, callback);
};
