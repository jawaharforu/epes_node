const mongoose = require('mongoose');
const config = require('../config/database');
const Company = require('./company');
const Jd = require('./jd');
const Question = require('./question');

const JdquestionSchema = mongoose.Schema({
    jdid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jd',
        required: [true,'No Company id found']
    },
    questionid: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }],
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

const Jdquestion = module.exports = mongoose.model('Jdquestion', JdquestionSchema);

module.exports.addJdquestion = function(newJdquestion, callback){
    newJdquestion.save(callback);
};

module.exports.deleteJdquestion = function(jdquestionid, callback){
    Jdquestion.remove({_id: jdquestionid}, callback);
};

module.exports.updateJdquestion = function(jdid, updateResult, callback){
    Jdquestion.update({jdid: jdid},updateResult, callback);
};