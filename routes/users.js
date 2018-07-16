const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');
const User = require('../models/user');

// Registration
router.post('/', (req, res, next) => {
    //res.send('registration');
    let fieldUser = {
        companyid: req.body.companyid,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
        subscribe: req.body.subscribe,
        status: req.body.status
    };
    if(req.body.userId) {
      User.updateUser(req.body.userId, fieldUser, (err, user) => {
        if(err){
            res.json({success: false, msg: 'Falied to register new user'});
        }else{
            res.json({success: true, msg: 'User registred'});
        }
      });
    } else {
      User.getUserByEmailCheck(req.body.email, (err, users) => {
        if(err) throw err;
        if(users){
            res.json({success:false, msg: "User email aleady exist"});
        }
        User.addUser(new User(fieldUser), (err, user) => {
            if(err){
                res.json({success: false, msg: 'Falied to register new user'});
            }else{
                res.json({success: true, msg: 'User registred', data: user});
            }
        });
      });
    }
});

// Authendicate
router.post('/authendicate', (req, res, next) => {
    //res.send('authendicate');
    const email = req.body.email;
    const password = req.body.password;

    User.getUserByEmailCheck(email, (err, user) => {
        if(err) throw err;
        if(!user){
            res.json({success:false, msg: "User not found"});
        }

        User.ComparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch){
                //console.log(user);
                let userDetail = {
                    id: user._id,
                    companyid: user.companyid,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    role: user.role,
                    subscribe: user.subscribe,
                    password: user.password
                };
                const token = jwt.sign(userDetail, config.secret, {
                    expiresIn: 604800 // 1 week
                });

                res.json({
                    success: true,
                    token: 'JWT '+token,
                    user: {
                        id: user._id,
                        companyid: user.companyid,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        email: user.email,
                        role: user.role,
                        subscribe: user.subscribe,
                        password: user.password
                    }
                });
            }else{
                res.json({success:false, msg: "Password not match"});
            }
        });
    });
});

// check user by email or id
router.post('/checkuser/:touser', (req, res, next) => {
  let getUser = {};
  if(req.params.touser === 'email') {
    getUser = {
      email: req.body.value
    };
  } else {
    getUser = {
      id: req.body.value
    };
  }
  User.findOne({getUser}).then(user => {
    if(!user){
      res.json({success:false, msg: "User not found"});
    }else{
      res.json({success:true, msg: "User exist", data: user});
    }
  }).catch(err => res.json(err));
});

// get current user using token
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      companyid: req.user.companyid,
      firstname: req.user.firstname,
      lastname: req.user.lastname,
      email: req.user.email,
      role: req.user.role,
      subscribe: req.user.subscribe,
      password: req.user.password
    });
  }
);

module.exports = router;
