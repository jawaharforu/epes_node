const mongoose = require('mongoose');
const config = require('../config/database');
const Company = require('./company');
const Scale = require('./scale');
const Header = require('./header');

const QuestionSchema = mongoose.Schema({
    question: {
        type: String
    },
    scaleid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Scale',
        required: [true,'No scale id found']
    },
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
    type: {
        type: String
    },
    role: {
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

const Question = module.exports = mongoose.model('Question', QuestionSchema);

module.exports.addQuestion = function(newQuestion, callback){
    newQuestion.save(callback);
};

module.exports.deleteQuestion = function(questionid, callback){
    Question.remove({_id: questionid}, callback);
};

module.exports.updateQuestion = function(questionid, updateResult, callback){
    Question.update({_id: questionid},updateResult, callback);
};

module.exports.getQuestionById = function(questionid, callback){
  Question.findById(questionid, callback);
};
