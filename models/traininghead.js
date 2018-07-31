const mongoose = require('mongoose');
const config = require('../config/database');
const Company = require('./company');

const TrainingheadSchema = mongoose.Schema({
    name: {
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

const Traininghead = module.exports = mongoose.model('Traininghead', TrainingheadSchema);

module.exports.addTraininghead = function(newTraininghead, callback){
    newTraininghead.save(callback);
};

module.exports.deleteTraininghead = function(Trainingheadid, callback){
    Traininghead.remove({_id: Trainingheadid}, callback);
};

module.exports.updateTraininghead = function(Trainingheadid, updateResult, callback){
    Traininghead.update({_id: Trainingheadid},updateResult, callback);
};

module.exports.getTrainingheadById = function(Trainingheadid, callback){
  Traininghead.findById(Trainingheadid, callback);
};
