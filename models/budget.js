const mongoose = require('mongoose');
const config = require('../config/database');
const Company = require('./company');

const BudgetSchema = mongoose.Schema({
    year: {
        type: Number
    },
    amount: {
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

const Budget = module.exports = mongoose.model('Budget', BudgetSchema);

module.exports.addBudget = function(newBudget, callback){
    newBudget.save(callback);
};

module.exports.deleteBudget = function(Budgetid, callback){
    Budget.remove({_id: Budgetid}, callback);
};

module.exports.updateBudget = function(Budgetid, updateResult, callback){
    Budget.update({_id: Budgetid},updateResult, callback);
};

module.exports.getBudgetById = function(Budgetid, callback){
  Budget.findById(Budgetid, callback);
};
