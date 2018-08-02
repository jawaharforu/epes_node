const mongoose = require('mongoose');
const config = require('../config/database');
const Company = require('./company');

const JdSchema = mongoose.Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    filename: {
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

const Jd = module.exports = mongoose.model('Jd', JdSchema);

module.exports.addJd = function(newJd, callback){
    newJd.save(callback);
};

module.exports.deleteJd = function(jdid, callback){
    Jd.remove({_id: jdid}, callback);
};

module.exports.updateJd = function(jdid, updateResult, callback){
    Jd.update({_id: jdid},updateResult, callback);
};

module.exports.getJdById = function(jdid, callback){
    Jd.findById(jdid, callback);
};
