const mongoose = require('mongoose');
const config = require('../../config/database');
const Company = require('../company');

const TestimonialSchema = mongoose.Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    image: {
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

const Testimonial = module.exports = mongoose.model('Testimonial', TestimonialSchema);

module.exports.addTestimonial = function(newTestimonial, callback){
    newTestimonial.save(callback);
};

module.exports.deleteTestimonial = function(testimonialid, callback){
    Testimonial.remove({_id: testimonialid}, callback);
};

module.exports.updateTestimonial = function(testimonialid, updateResult, callback){
    Testimonial.update({_id: testimonialid},updateResult, callback);
};

module.exports.gerTestimonialById = function(testimonialid, callback){
    Testimonial.findById(testimonialid, callback);
};
