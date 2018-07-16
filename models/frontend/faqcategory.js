const mongoose = require('mongoose');
const config = require('../../config/database');
const Company = require('../company');

const FaqcategorySchema = mongoose.Schema({
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

const Faqcategory = module.exports = mongoose.model('Faqcategory', FaqcategorySchema);

module.exports.addFaqcategory = function(newFaqcategory, callback){
    newFaqcategory.save(callback);
};

module.exports.deleteFaqcategory = function(faqcategoryid, callback){
    Faqcategory.remove({_id: faqcategoryid}, callback);
};

module.exports.updateFaqcategory = function(faqcategoryid, updateResult, callback){
    Faqcategory.update({_id: faqcategoryid},updateResult, callback);
};

module.exports.gerFaqcategoryById = function(faqcategoryid, callback){
    Faqcategory.findById(faqcategoryid, callback);
};
