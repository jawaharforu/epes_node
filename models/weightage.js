const mongoose = require('mongoose');
const config = require('../config/database');
const Company = require('./company');

const WeightageSchema = mongoose.Schema({
    jdid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jd',
        required: [true,'No JD id found']
    },
    weightage: [
      {
        assessmenttypeid: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Assessmenttype',
          required: [true,'No scale id found']
        },
        header: [
          {
            headerid: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Header',
              required: [true,'No header id found']
            },
            weightagerate: {
              type: String
            }
          }
        ],
      }
    ],
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

const Weightage = module.exports = mongoose.model('Weightage', WeightageSchema);

module.exports.addWeightage = function(newWeightage, callback){
    newWeightage.save(callback);
};

module.exports.deleteWeightage = function(Weightageid, callback){
  Weightage.remove({_id: Weightageid}, callback);
};

module.exports.updateWeightage = function(jdid, updateResult, callback){
  Weightage.update({jdid: jdid},updateResult, callback);
};

module.exports.getWeightageById = function(Weightageid, callback){
  Weightage.findById(Weightageid, callback);
};
