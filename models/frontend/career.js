const mongoose = require('mongoose');
const config = require('../../config/database');
const Company = require('../company');

const CareerSchema = mongoose.Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    status: {
        type: Boolean,
        default: true
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

const Career = module.exports = mongoose.model('Career', CareerSchema);

module.exports.addCareer = function(newCareer, callback){
    newCareer.save(callback);
};

module.exports.deleteCareer = function(Careerid, callback){
    Career.remove({_id: Careerid}, callback);
};

module.exports.updateCareer = function(Careerid, updateResult, callback){
    Career.update({_id: Careerid},updateResult, callback);
};

module.exports.getCareerById = function(Careerid, callback){
    Career.findById(Careerid, callback);
};
