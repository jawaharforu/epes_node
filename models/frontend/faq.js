const mongoose = require('mongoose');
const config = require('../../config/database');
const Company = require('../company');

const FaqSchema = mongoose.Schema({
    faqcategoryid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faqcategory',
      required: [true,'No Faq category id found']
    },
    question: {
      type: String
    },
    answer: {
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

const Faq = module.exports = mongoose.model('Faq', FaqSchema);

module.exports.addFaq = function(newFaq, callback){
    newFaq.save(callback);
};

module.exports.deleteFaq = function(Faqid, callback){
    Faq.remove({_id: Faqid}, callback);
};

module.exports.updateFaq = function(Faqid, updateResult, callback){
    Faq.update({_id: Faqid},updateResult, callback);
};

module.exports.gerFaqById = function(Faqid, callback){
    Faq.findById(Faqid, callback);
};

module.exports.getAllFaqsByCategory = function(faqcategoryid, callback) {
  Faq.aggregate([
      {
          $match: {
              'faqcategoryid': mongoose.Types.ObjectId(faqcategoryid)
          }
      },
      {
          $lookup: {
              from: 'Faqcategories',
              localField: 'faqcategoryid',
              foreignField: '_id',
              as: 'categoryname'
          }
      },
      { $sort: { createdon: -1 } }
  ], callback);
};
