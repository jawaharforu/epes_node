const mongoose = require('mongoose');
const config = require('../config/database');
const Company = require('./company');

const HeaderSchema = mongoose.Schema({
    headername: {
        type: String
    },
    description: {
        type: String
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

const Header = module.exports = mongoose.model('Header', HeaderSchema);

module.exports.addHeader = function(newHeader, callback){
    newHeader.save(callback);
};

module.exports.deleteHeader = function(headerid, callback){
    Header.remove({_id: headerid}, callback);
};

module.exports.updateHeader = function(headerid, updateResult, callback){
    Header.update({_id: headerid},updateResult, callback);
};