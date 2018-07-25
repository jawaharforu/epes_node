const express = require('express');
const router = express.Router();
const passport = require('passport');

var CountryCodes = require('../../json/CountryCodes.json');

router.get('/countryCodes', function (req, res, next) {
  res.json({success: true, data: CountryCodes});
});

module.exports = router;
