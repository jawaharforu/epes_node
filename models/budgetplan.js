const mongoose = require('mongoose');
const config = require('../config/database');
const Company = require('./company');

const BudgetplanSchema = mongoose.Schema({
    assessmenttypeid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assessmenttype',
        required: [true,'No scale id found']
    },
    headerid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Header',
        required: [true,'No header id found']
    },
    trainingheadid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Traininghead',
        required: [true,'No traininghead id found']
    },
    trainingsubheadid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trainingsubhead',
        required: ['No trainingsubhead id found']
    },
    budgetid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Budget',
        required: [true,'No scale id found']
    },
    percentage: {
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

const Budgetplan = module.exports = mongoose.model('Budgetplan', BudgetplanSchema);

module.exports.addBudgetplan = function(newBudgetplan, callback){
    newBudgetplan.save(callback);
};

module.exports.deleteBudgetplan = function(Budgetplanid, callback){
    Budgetplan.remove({_id: Budgetplanid}, callback);
};

module.exports.updateBudgetplan = function(Budgetplanid, updateResult, callback){
    Budgetplan.update({_id: Budgetplanid},updateResult, callback);
};

module.exports.getBudgetplanById = function(Budgetplanid, callback){
  Budgetplan.findById(Budgetplanid, callback);
};
