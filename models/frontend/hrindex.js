const mongoose = require('mongoose');
const config = require('../../config/database');
const Company = require('../company');

const HRindexSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    mobile: {
        type: String
    },
    designation: {
      type: String
    },
    companyname: {
        type: String
    },
    industry: {
        type: String
    },
    staffing: {
        type: String
    },
    traininganddevelopment: {
        type: String
    },
    performancesystems: {
        type: String
    },
    safetyandhealth: {
        type: String
    },
    labourrelations: {
        type: String
    },
    internalcommunication: {
        type: String
    },
    diversity: {
        type: String
    },
    role: {
        type: String
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

const HRindex = module.exports = mongoose.model('HRindex', HRindexSchema);

module.exports.addHRindex = function(newHRindex, callback){
    newHRindex.save(callback);
};

module.exports.deleteHRindex = function(HRindexid, callback){
    HRindex.remove({_id: HRindexid}, callback);
};

module.exports.updateHRindex = function(HRindexid, updateResult, callback){
    HRindex.update({_id: HRindexid},updateResult, callback);
};

module.exports.getHRindexById = function(HRindexid, callback){
    HRindex.findById(HRindexid, callback);
};
