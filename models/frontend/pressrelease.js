const mongoose = require('mongoose');
const config = require('../../config/database');
const Company = require('../company');

const PressreleaseSchema = mongoose.Schema({
    name: {
        type: String
    },
    image: {
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

const Pressrelease = module.exports = mongoose.model('Pressrelease', PressreleaseSchema);

module.exports.addPressrelease = function(newPressrelease, callback){
    newPressrelease.save(callback);
};

module.exports.deletePressrelease = function(Pressreleaseid, callback){
    Pressrelease.remove({_id: Pressreleaseid}, callback);
};

module.exports.updatePressrelease = function(Pressreleaseid, updateResult, callback){
    Pressrelease.update({_id: Pressreleaseid},updateResult, callback);
};

module.exports.gerPressreleaseById = function(Pressreleaseid, callback){
    Pressrelease.findById(Pressreleaseid, callback);
};
