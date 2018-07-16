const mongoose = require('mongoose');
const config = require('../../config/database');
const Company = require('../company');

const ProductSchema = mongoose.Schema({
    name: {
        type: String
    },
    type: {
        type: String
    },
    amount: {
        type: Number
    },
    numberofemployee: {
        type: Number
    },
    amountperemployee: {
        type: Number
    },
    additionfeatures: {
        type: Array
    },
    status: {
        type: Boolean,
        default: false
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

const Product = module.exports = mongoose.model('Product', ProductSchema);

module.exports.addProduct = function(newProduct, callback){
    newProduct.save(callback);
};

module.exports.deleteProduct = function(productid, callback){
    Product.remove({_id: productid}, callback);
};

module.exports.updateProduct = function(productid, updateResult, callback){
    Product.update({_id: productid},updateResult, callback);
};

module.exports.gerProductById = function(productid, callback){
    Product.findById(productid, callback);
};
