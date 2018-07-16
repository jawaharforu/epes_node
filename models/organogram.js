const mongoose = require('mongoose');
const config = require('../config/database');
const Company = require('./company');

const OrganogramSchema = mongoose.Schema({
    name: {
        type: String
    },
    department: {
        type: String
    },
    designation: {
        type: String
    },
    parentid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organogram',
        required: [true,'No Organogram id found']
    },
    level: {
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

const Organogram = module.exports = mongoose.model('Organogram', OrganogramSchema);

module.exports.addOrganogram = function(newOrganogram, callback){
    newOrganogram.save(callback);
};

module.exports.deleteJdquestion = function(organogramid, callback){
    Organogram.remove({_id: organogramid}, callback);
};

module.exports.updateJdquestion = function(organogramid, updateResult, callback){
    Organogram.update({_id: organogramid},updateResult, callback);
};