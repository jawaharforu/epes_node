const mongoose = require('mongoose');
const config = require('../config/database');
const Company = require('./company');

const TrainingsubheadSchema = mongoose.Schema({
    name: {
        type: String
    },
    trainingheadid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Traininghead',
      required: [true,'No Traininghead id found']
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

const Trainingsubhead = module.exports = mongoose.model('Trainingsubhead', TrainingsubheadSchema);

module.exports.addTrainingsubhead = function(newTrainingsubhead, callback){
    newTrainingsubhead.save(callback);
};

module.exports.deleteTrainingsubhead = function(Trainingsubheadid, callback){
    Trainingsubhead.remove({_id: Trainingsubheadid}, callback);
};

module.exports.updateTrainingsubhead = function(Trainingsubheadid, updateResult, callback){
    Trainingsubhead.update({_id: Trainingsubheadid},updateResult, callback);
};

module.exports.getTrainingsubheadById = function(Trainingsubheadid, callback){
  Trainingsubhead.findById(Trainingsubheadid, callback);
};
