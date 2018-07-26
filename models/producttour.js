const mongoose = require('mongoose');
const config = require('../config/database');

const ProducttourSchema = mongoose.Schema({
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    industry: {
        type: String
    },
    email: {
        type: String,
        require: true
    },
    noofemployees: {
        type: String
    },
    countrycode: {
      type: String
    },
    contact: {
        type: String
    },
    company: {
        type: String
    },
    country: {
        type: String
    },
    status: {
        type: Boolean
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

const Producttour = module.exports = mongoose.model('Producttour', ProducttourSchema);

module.exports.addProducttour = function(newProducttour, callback){
    newProducttour.save(callback);
};

module.exports.deleteProducttour = function(Producttourid, callback){
    Producttour.remove({_id: Producttourid}, callback);
};

module.exports.updateProducttour = function(Producttourid, updateResult, callback){
    Producttour.update({_id: Producttourid},updateResult, callback);
};

module.exports.getProducttourById = function(Producttourid, callback){
    Producttour.findById(Producttourid, callback);
};
