const mongoose = require('mongoose');
const config = require('../../config/database');
const Company = require('../company');

const WhitepaperSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    company: {
        type: String
    },
    website: {
        type: String
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

const Whitepaper = module.exports = mongoose.model('Whitepaper', WhitepaperSchema);

module.exports.addWhitepaper = function(newWhitepaper, callback){
    newWhitepaper.save(callback);
};

module.exports.deleteWhitepaper = function(Whitepaperid, callback){
    Whitepaper.remove({_id: Whitepaperid}, callback);
};

module.exports.updateWhitepaper = function(Whitepaperid, updateResult, callback){
    Whitepaper.update({_id: Whitepaperid},updateResult, callback);
};

module.exports.getWhitepaperById = function(Whitepaperid, callback){
    Whitepaper.findById(Whitepaperid, callback);
};
