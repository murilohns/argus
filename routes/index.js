var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
require('../controllers/mongo');

var models = require('../models');

router.get('/status', (req, res, next) => {
  res.send("I'm alive!");
});

router.get('/organizations', async (req, res, next) => {
  let organizations = await models.organization.find();
  res.json(organizations);
});

router.get('*', async (req, res, next) => {
  res.sendStatus(404);
});

module.exports = router;
