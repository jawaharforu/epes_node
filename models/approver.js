const mongoose = require('mongoose');
const config = require('../config/database');
const Company = require('./company');

const ApproverSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    designation: {
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

const Approver = module.exports = mongoose.model('Approver', ApproverSchema);

module.exports.addApprover = function(newApprover, callback){
    newApprover.save(callback);
};

module.exports.deleteApprover = function(approverid, callback){
    Approver.remove({_id: approverid}, callback);
};

module.exports.updateApprover = function(approverid, updateResult, callback){
    Approver.update({_id: approverid},updateResult, callback);
};

module.exports.gerApproverById = function(approverid, callback){
    Approver.findById(approverid, callback);
};
