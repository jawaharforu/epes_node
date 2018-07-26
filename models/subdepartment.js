const mongoose = require('mongoose');
const config = require('../config/database');
const Company = require('./company');

const SubdepartmentSchema = mongoose.Schema({
    name: {
        type: String
    },
    departmentid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true,'No Depatment id found']
    },
    companyid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true,'No Company id found']
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

const Subdepartment = module.exports = mongoose.model('Subdepartment', SubdepartmentSchema);

module.exports.addSubdepartment = function(newSubdepartment, callback){
    newSubdepartment.save(callback);
};

module.exports.deleteSubdepartment = function(Subdepartmentid, callback){
    Subdepartment.remove({_id: Subdepartmentid}, callback);
};

module.exports.updateSubdepartment = function(Subdepartmentid, updateResult, callback){
    Subdepartment.update({_id: Subdepartmentid},updateResult, callback);
};

module.exports.getSubdepartmentById = function(Subdepartmentid, callback){
    Subdepartment.findById(Subdepartmentid, callback);
};
