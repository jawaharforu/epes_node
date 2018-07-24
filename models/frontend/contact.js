const mongoose = require('mongoose');
const config = require('../../config/database');
const Company = require('../company');

const ContactSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    mobile: {
        type: String
    },
    message: {
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

const Contact = module.exports = mongoose.model('Contact', ContactSchema);

module.exports.addContact = function(newContact, callback){
    newContact.save(callback);
};

module.exports.deleteContact = function(Contactid, callback){
    Contact.remove({_id: Contactid}, callback);
};

module.exports.updateContact = function(Contactid, updateResult, callback){
    Contact.update({_id: Contactid},updateResult, callback);
};

module.exports.getContactById = function(Contactid, callback){
    Contact.findById(Contactid, callback);
};
