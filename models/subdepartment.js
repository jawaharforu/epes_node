const mongoose = require('mongoose');
const config = require('../config/database');
const Company = require('./company');

const SubdepatmentSchema = mongoose.Schema({
    name: {
        type: String
    },
    departmentid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Depatment',
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

const Subdepatment = module.exports = mongoose.model('Subdepatment', SubdepatmentSchema);

module.exports.addSubdepatment = function(newSubdepatment, callback){
    newSubdepatment.save(callback);
};

module.exports.deleteSubdepatment = function(Subdepatmentid, callback){
    Subdepatment.remove({_id: Subdepatmentid}, callback);
};

module.exports.updateSubdepatment = function(Subdepatmentid, updateResult, callback){
    Subdepatment.update({_id: Subdepatmentid},updateResult, callback);
};

module.exports.gerSubdepatmentById = function(Subdepatmentid, callback){
    Subdepatment.findById(Subdepatmentid, callback);
};
