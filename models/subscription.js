const mongoose = require('mongoose');
const config = require('../config/database');
const Company = require('./company');

const SubscriptionSchema = mongoose.Schema({
    productid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true,'No Company id found']
    },
    extraemployees: {
        type: Number
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

const Subscription = module.exports = mongoose.model('Subscription', SubscriptionSchema);

module.exports.addSubscription = function(newSubscription, callback){
    newSubscription.save(callback);
};

module.exports.deleteSubscription = function(Subscriptionid, callback){
    Subscription.remove({_id: Subscriptionid}, callback);
};

module.exports.updateSubscription = function(Subscriptionid, updateResult, callback){
    Subscription.update({_id: Subscriptionid},updateResult, callback);
};

module.exports.getSubscriptionById = function(Subscriptionid, callback){
  Subscription.findById(Subscriptionid, callback);
};
