const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../../config/database');

const Contact = require('../../models/frontend/contact');

router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let fieldContact = {
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      message: req.body.message,
      role: 'superadmin'
  };

  if(req.body.contactid) {
    Contact.updateContact(req.body.contactid, fieldContact, (err, contact) => {
      if(err) {
        res.json({success: false, msg: 'Failed to update Contact'});
      } else {
        res.json({success: true, msg: 'Contact Updated'});
      }
    });
  } else {
    Contact.addContact(new Contact(fieldContact), (err, contact) => {
      if(err){
        res.json({success: false, msg: 'Failed to add Contact'});
      }else{
          res.json({success: true, msg: 'Contact Add', data: contact});
      }
    });
  }
});

router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Contact.find()
  .then(contact => {
    res.json({success: true, data: contact});
  })
  .catch(err => console.log(err));
});

router.delete('/:contactid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Contact.getContactById(req.params.contactid, (err, contact) => {
    if (contact) {
      if(contact.role === req.user.role) {
        Contact.deleteContact(req.params.contactid, (err, result) => {
          if(err){
            res.json({success: false, msg: 'Failed to delete Contact'});
          }else{
            res.json({success: true, msg: 'Contact deleted successfully'});
          }
        });
      } else {
        res.json({success: false, msg: 'Your not allowed to delete'});
      }
    } else {
      res.json({success: false, msg: 'Contact not found'});
    }
  });
});

router.get('/:contactid', (req, res, next) => {
  Contact.gerContactById(req.params.contactid, (err, contact) => {
    if (contact) {
      res.json({success: true, data: contact});
    } else {
      res.json({success: false, msg: 'Contact not found'});
    }
  });
});

router.get('/get/list', (req, res) => {
  Contact.find({status: true})
  .then(contact => {
    res.json({success: true, data: contact});
  })
  .catch(err => console.log(err));
});

module.exports = router;
