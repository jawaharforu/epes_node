const mongoose = require('mongoose');
const config = require('../config/database');
const Company = require('./company');

const EmailtemplateSchema = mongoose.Schema({
    name: {
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

const Emailtemplate = module.exports = mongoose.model('Emailtemplate', EmailtemplateSchema);

module.exports.addEmailtemplate = function(newEmailtemplate, callback){
    newEmailtemplate.save(callback);
};

module.exports.deleteEmailtemplate = function(Emailtemplateid, callback){
    Emailtemplate.remove({_id: Emailtemplateid}, callback);
};

module.exports.updateEmailtemplate = function(Emailtemplateid, updateResult, callback){
    Emailtemplate.update({_id: Emailtemplateid},updateResult, callback);
};

module.exports.getEmailtemplateById = function(Emailtemplateid, callback){
  Emailtemplate.findById(Emailtemplateid, callback);
};
