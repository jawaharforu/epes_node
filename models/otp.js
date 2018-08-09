const mongoose = require('mongoose');
const config = require('../config/database');

const OtpSchema = mongoose.Schema({
    email: {
        type: String
    },
    otp: {
        type: String
    },
    userd: {
        type: Boolean
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

const Otp = module.exports = mongoose.model('Otp', OtpSchema);

module.exports.addOtp = function(newOtp, callback){
    newOtp.save(callback);
};

module.exports.deleteOtp = function(Otpid, callback){
    Otp.remove({_id: Otpid}, callback);
};

module.exports.updateOtp = function(Otpid, updateResult, callback){
    Otp.update({_id: Otpid},updateResult, callback);
};

module.exports.getOtpById = function(Otpid, callback){
    Otp.findById(Otpid, callback);
};
