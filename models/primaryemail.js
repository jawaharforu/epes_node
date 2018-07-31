const mongoose = require('mongoose');
const config = require('../config/database');
const Company = require('./company');

const PrimaryemailSchema = mongoose.Schema({
    email: {
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

const Primaryemail = module.exports = mongoose.model('Primaryemail', PrimaryemailSchema);

module.exports.addPrimaryemail = function(newPrimaryemail, callback){
    newPrimaryemail.save(callback);
};

module.exports.deletePrimaryemail = function(Primaryemailid, callback){
    Primaryemail.remove({_id: Primaryemailid}, callback);
};

module.exports.updatePrimaryemail = function(Primaryemailid, updateResult, callback){
    Primaryemail.update({_id: Primaryemailid},updateResult, callback);
};

module.exports.getPrimaryemailById = function(Primaryemailid, callback){
  Primaryemail.findById(Primaryemailid, callback);
};
