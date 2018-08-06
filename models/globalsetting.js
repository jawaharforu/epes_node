const mongoose = require('mongoose');
const config = require('../config/database');
const Company = require('./company');

const GlobalsettingSchema = mongoose.Schema({
    tolerance: {
        type: Number
    },
    externalreference: {
        type: Number
    },
    internalemployeereference: {
        type: Number
    },
    managingdirectorsdescretion: {
        type: Number
    },
    specialallowance: {
        type: Number
    },
    cim: {
        type: Number
    },
    nocim: {
        type: Number
    },
    thirdpartyevaluation1: {
        type: Number
    },
    thirdpartyevaluation2: {
        type: Number
    },
    thirdpartyevaluation3: {
        type: Number
    },
    controlsworkingaquantance05: {
        type: Number
    },
    controlsworkingaquantance510: {
        type: Number
    },
    controlsworkingaquantance10: {
        type: Number
    },
    chairmansreference: {
        type: Number
    },
    overworkingaquantance05: {
        type: Number
    },
    overworkingaquantance510: {
        type: Number
    },
    overworkingaquantance10: {
        type: Number
    },
    overpriorrelevant05: {
        type: Number
    },
    overpriorrelevant510: {
        type: Number
    },
    overpriorrelevant10: {
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

const Globalsetting = module.exports = mongoose.model('Globalsetting', GlobalsettingSchema);

module.exports.addGlobalsetting = function(newGlobalsetting, callback){
    newGlobalsetting.save(callback);
};

module.exports.deleteGlobalsetting = function(Globalsettingid, callback){
    Globalsetting.remove({_id: Globalsettingid}, callback);
};

module.exports.updateGlobalsetting = function(Globalsettingid, updateResult, callback){
    Globalsetting.update({_id: Globalsettingid},updateResult, callback);
};

module.exports.getGlobalsettingById = function(Globalsettingid, callback){
  Globalsetting.findById(Globalsettingid, callback);
};
