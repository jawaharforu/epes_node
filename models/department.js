const mongoose = require('mongoose');
const config = require('../config/database');
const Company = require('./company');

const DepartmentSchema = mongoose.Schema({
    name: {
        type: String
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

const Department = module.exports = mongoose.model('Department', DepartmentSchema);

module.exports.addDepartment = function(newDepartment, callback){
    newDepartment.save(callback);
};

module.exports.deleteDepartment = function(Departmentid, callback){
    Department.remove({_id: Departmentid}, callback);
};

module.exports.updateDepartment = function(Departmentid, updateResult, callback){
    Department.update({_id: Departmentid},updateResult, callback);
};

module.exports.getDepartmentById = function(Departmentid, callback){
    Department.findById(Departmentid, callback);
};
