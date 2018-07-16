const mongoose = require('mongoose');
const config = require('../config/database');

const CompanySchema = mongoose.Schema({
    jobtitle: {
        type: String
    },
    compnayname: {
        type: String
    },
    industry: {
        type: String
    },
    noofemployees: {
        type: Number
    },
    companycontact: {
        type: String
    },
    companyaddress: {
        type: String
    },
    country: {
        type: String
    },
    state: {
        type: String
    },
    city: {
        type: String
    },
    status: {
        type: Boolean
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

const Company = module.exports = mongoose.model('Company', CompanySchema);

module.exports.addCompany = function(newCompany, callback){
    newCompany.save(callback);
};

module.exports.deleteCompany = function(companyid, callback){
    Company.remove({_id: companyid}, callback);
};

module.exports.updateCompany = function(companyid, updateResult, callback){
    Company.update({_id: companyid},updateResult, callback);
};

