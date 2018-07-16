const mongoose = require('mongoose');
const config = require('../config/database');
const Company = require('./company');
const Organogram = require('./organogram');

const EmployeeSchema = mongoose.Schema({
    employeenum: {
        type: String
    },
    employeename: {
        type: String
    },
    designation: {
        type: String
    },
    email: {
        type: String
    },
    mobile: {
        type: String
    },
    address: {
        type: String
    },
    status: {
        type: Boolean
    },
    organogramid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organogram',
        required: [true,'No Organogram id found']
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

const Employee = module.exports = mongoose.model('Employee', EmployeeSchema);

module.exports.addEmployee = function(newEmployee, callback){
    newEmployee.save(callback);
};

module.exports.deleteEmployee = function(employeeid, callback){
    Employee.remove({_id: employeeid}, callback);
};

module.exports.updateEmployee = function(employeeid, updateResult, callback){
    Employee.update({_id: employeeid},updateResult, callback);
};