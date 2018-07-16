const mongoose = require('mongoose');
const config = require('../config/database');
const Company = require('./company');

const ScaleSchema = mongoose.Schema({
    noofoption: {
        type: Number
    },
    options: {
        type: Array
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

const Scale = module.exports = mongoose.model('Scale', ScaleSchema);

module.exports.addScale = function(newScale, callback){
    newScale.save(callback);
};

module.exports.deleteScale = function(scaleid, callback){
    Scale.remove({_id: scaleid}, callback);
};

module.exports.updateScale = function(scaleid, updateResult, callback){
    Scale.update({_id: scaleid},updateResult, callback);
};