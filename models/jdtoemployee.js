const mongoose = require('mongoose');
const config = require('../config/database');
const Company = require('./company');
const Jd = require('./jd');
const Employee = require('./employee');

const JdtoemployeeSchema = mongoose.Schema({
    jdid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jd',
        required: [true,'No Organogram id found']
    },
    employeeid: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: [true,'No Organogram id found']
    }],
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

const Jdtoemployee = module.exports = mongoose.model('Jdtoemployee', JdtoemployeeSchema);

module.exports.addJdtoemployee = function(newJdtoemployee, callback){
    newJdtoemployee.save(callback);
};

module.exports.deleteJdtoemployee = function(jdid, callback){
    Jdtoemployee.remove({jdid: jdid}, callback);
};

module.exports.updateJdtoemployee = function(jdid, updateResult, callback){
    Jdtoemployee.update({jdid: jdid},updateResult, callback);
};

module.exports.getJdtoemployeeById = function(jdtoemployeeid, callback){
  Jdtoemployee.findById(jdtoemployeeid, callback);
};
