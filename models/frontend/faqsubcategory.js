const mongoose = require('mongoose');
const config = require('../../config/database');
const Company = require('../company');
const Faqcategory = require('./faqcategory');

const FaqsubcategorySchema = mongoose.Schema({
    name: {
        type: String
    },
    faqcategoryid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faqcategory',
      required: [true,'No Company id found']
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

const Faqsubcategory = module.exports = mongoose.model('Faqsubcategory', FaqsubcategorySchema);

module.exports.addFaqsubcategory = function(newFaqsubcategory, callback){
    newFaqsubcategory.save(callback);
};

module.exports.deleteFaqsubcategory = function(faqsubcategoryid, callback){
    Faqsubcategory.remove({_id: faqsubcategoryid}, callback);
};

module.exports.updateFaqsubcategory = function(faqsubcategoryid, updateResult, callback){
    Faqsubcategory.update({_id: faqsubcategoryid},updateResult, callback);
};

module.exports.gerFaqsubcategoryById = function(faqsubcategoryid, callback){
    Faqsubcategory.findById(faqsubcategoryid, callback);
};

module.exports.getAllFaqsByCategory = function(callback) {
  Faqsubcategory.aggregate([
      {
          $lookup: {
              from: 'Faqcategories',
              localField: 'faqcategoryid',
              foreignField: '_id',
              as: 'categoryname'
          }
      },
      {   $sort: {
              _id: '$faqcategoryid'
          }
      }
  ], callback);
};
