const mongoose = require('mongoose');
const config = require('../../config/database');
const Company = require('../company');

const FeatureSchema = mongoose.Schema({
    name: {
        type: String
    },
    image: {
        type: String
    },
    description: {
        type: String
    },
    status: {
        type: Boolean,
        default: true
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

const Feature = module.exports = mongoose.model('Feature', FeatureSchema);

module.exports.addFeature = function(newFeature, callback){
    newFeature.save(callback);
};

module.exports.deleteFeature = function(featureid, callback){
    Feature.remove({_id: featureid}, callback);
};

module.exports.updateFeature = function(featureid, updateResult, callback){
    Feature.update({_id: featureid},updateResult, callback);
};

module.exports.gerFeatureById = function(featureid, callback){
    Feature.findById(featureid, callback);
};
