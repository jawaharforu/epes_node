const mongoose = require('mongoose');
const config = require('../config/database');
const bcrypt = require('bcryptjs');
const Company = require('./company');

// User Schema
const UserSchema = mongoose.Schema({
    companyid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true,'No Company id found']
    },
    firstname: {
        type: String
    },
    middlename: {
        type: String
    },
    lastname: {
        type: String
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        require: true
    },
    subscribe: {
        type: Number,
        default: 10
    },
    superadmin: {
        type: Number,
        default: 0
    },
    status: {
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

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
};
/*
module.exports.getUserByMobileCheck = function(email, callback){
    User.findOne({ $or: [ { email: email } ] }, callback);
};
*/
module.exports.getUserByEmailCheck = function(email, callback){
    const query = {
        email: email
    }
    User.findOne(query, callback);
};

module.exports.getAllUser = function(callback){
    const query = {
        superadmin: 0,
        role: { $in: [ 'admin',  'paid' ] }
    }
    User.find(query, callback);
};

module.exports.addUser = function(newUser, callback){
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

module.exports.deleteUser = function(uid, callback){
    User.remove({_id: uid}, callback);
} ;

module.exports.updateUser = function(uid, updatedProduct, callback){
    User.update({_id: uid},updatedProduct, callback);
} ;

module.exports.ComparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err) throw err;
        callback(null, isMatch);
    });
};

module.exports.updateUserPassword = function(uid, updatedProduct, callback){
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(updatedProduct.password, salt, (err, hash) => {
            if(err) throw err;
            updatedProduct.password = hash;
            User.update({_id: uid},updatedProduct, callback);
        });
    });
};

module.exports.getUserById = function(uid, callback){
  Company.findById(uid, callback);
};
