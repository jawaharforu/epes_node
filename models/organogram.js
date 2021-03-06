const mongoose = require('mongoose');
const config = require('../config/database');
const Company = require('./company');
var autoIncrement = require("mongodb-autoincrement");

const OrganogramSchema = mongoose.Schema({
    name: {
        type: String
    },
    departmentid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: [true,'No Company id found']
    },
    subdepartmentid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subdepartment'
    },
    designation: {
        type: String
    },
    parentid: {
        type: Number,
        require: true
    },
    uniqueid: {
        type: Number,
        require: true
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

const Organogram = module.exports = mongoose.model('Organogram', OrganogramSchema);

module.exports.addOrganogram = function(newOrganogram, callback){
    newOrganogram.save(callback);
};

module.exports.deleteOrganogram = function(organogramid, callback){
    Organogram.remove({_id: organogramid}, callback);
};

module.exports.updateOrganogram = function(organogramid, updateResult, callback){
    Organogram.update({_id: organogramid},updateResult, callback);
};

module.exports.getOrganogramById = function(organogramid, callback){
    Organogram.findById(organogramid, callback).populate('departmentid').populate('subdepartmentid');
};

module.exports.deleteOrganogramParent = function(parentid, callback){
  Organogram.remove({parentid: parentid}, callback);
};
