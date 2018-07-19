const mongoose = require('mongoose');
const config = require('../../config/database');
const Company = require('../company');

const ProductroadmapSchema = mongoose.Schema({
    name: {
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

const Productroadmap = module.exports = mongoose.model('Productroadmap', ProductroadmapSchema);

module.exports.addProductroadmap = function(newProductroadmap, callback){
    newProductroadmap.save(callback);
};

module.exports.deleteProductroadmap = function(Productroadmapid, callback){
    Productroadmap.remove({_id: Productroadmapid}, callback);
};

module.exports.updateProductroadmap = function(Productroadmapid, updateResult, callback){
    Productroadmap.update({_id: Productroadmapid},updateResult, callback);
};

module.exports.gerProductroadmapById = function(Productroadmapid, callback){
    Productroadmap.findById(Productroadmapid, callback);
};
