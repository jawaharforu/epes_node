const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');
const User = require('../models/user');
const SendEmail = require('../thirdparty/email');
const Otp = require('../models/otp');

// Registration
router.post('/', (req, res, next) => {
    //res.send('registration');
    let fieldUser = {
        companyid: req.body.companyid,
        firstname: req.body.firstname,
        middlename: req.body.middlename,
        lastname: req.body.lastname,
        mobile: req.body.mobile,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
        subscribe: req.body.subscribe,
        status: req.body.status
    };
    if(req.body.userid) {
      User.updateUser(req.body.userid, fieldUser, (err, user) => {
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
        } else {
          User.addUser(new User(fieldUser), (err, user) => {
              if(err){
                  res.json({success: false, msg: 'Falied to register new user'});
              }else{
                  res.json({success: true, msg: 'User registred', data: user});
              }
          });
        }
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
        } else {
          User.ComparePassword(password, user.password, (err, isMatch) => {
              if(err) throw err;
              if(isMatch){
                  //console.log(user);
                  let userDetail = {
                      id: user._id,
                      companyid: user.companyid,
                      firstname: user.firstname,
                      lastname: user.lastname,
                      mobile: user.mobile,
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
                          mobile: user.mobile,
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
        }
    });
});

// check user by email or id
router.post('/checkuser/email', (req, res, next) => {
  User.findOne({email: req.body.email}).then(user => {
    if(!user){
      res.json({success:false, msg: "User not found"});
    }else{
      res.json({success:true, msg: "User exist", data: user});
    }
  }).catch(err => res.json(err));
});

router.post('/check/otp', (req, res, next) => {
  Otp.findById(req.body.otpid).then(otp => {
    if(otp){
      if(otp.otp === req.body.otp) {
        res.json({success:true, msg: "OTP matched"});
      } else {
        res.json({success:false, msg: "User not found"});
      }
    }else{
      res.json({success:false, msg: "OTP Not matching"});
    }
  }).catch(err => res.json(err));
});

router.post('/send/email/otp', async (req, res, next) => {
  const randomnumber = Math.floor(Math.random() * 99999) + 9999;
  var subject = '360EPES - OTP';
  var body = `
        <h2>360EPES - OTP</h2>
        <h3>${randomnumber}</h3>
        <p>otp will expire in 5 min</p>
    `;
  var send = await SendEmail.sendEmail(req.body.email, subject, body);
  if (send) {
    let field = {
      email: req.body.email,
      otp: randomnumber,
      userd: false,
    };
    Otp.addOtp(new Otp(field), (err, otp) => {
      if(err){
        res.json({success: false, msg: 'Failed to load otp'});
      }else{
        res.json({success: true, msg: 'Otp sent', data: otp});
      }
    });
  } else {
    res.json({success: false, msg: 'Failed to send otp'});
  }
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
      middlename: req.user.middlename,
      lastname: req.user.lastname,
      mobile: req.user.mobile,
      email: req.user.email,
      role: req.user.role,
      subscribe: req.user.subscribe,
      password: req.user.password
    });
  }
);

router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  if(req.user.role === 'superadmin') {
    User.find()
    .populate('companyid')
    .then(user => {
      res.json({success: true, data: user});
    })
    .catch(err => console.log(err));
  } else {
    res.json({success: false, data: 'Your not allowed'});
  }
});

router.delete('/:userid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  User.getUserById(req.params.userid, (err, user) => {
    if (user) {
      if(req.user.role === 'superadmin') {
        User.deleteUser(req.params.userid, (err, result) => {
          if(err){
            res.json({success: false, msg: 'Failed to delete User'});
          }else{
            res.json({success: true, msg: 'User deleted successfully'});
          }
        });
      } else {
        res.json({success: false, msg: 'Your not allowed to delete'});
      }
    } else {
      res.json({success: false, msg: 'User not found'});
    }
  });
});

router.get('/:userid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  User.getUserById(req.params.userid, (err, user) => {
    if (user) {
      if(req.user.role === 'superadmin' || user.companyid.toString() === req.user.companyid.toString()) {
        res.json({success: true, data: user});
      } else {
        res.json({success: false, msg: 'Your not allowed to delete'});
      }
    } else {
      res.json({success: false, msg: 'Company not found'});
    }
  });
});

module.exports = router;
