var express = require('express');
var router = express.Router();
var Promise = require('bluebird');

var models = require('../models');

router.get('/status', (req, res, next) => {
  res.send("I'm alive!");
});

module.exports = router;
