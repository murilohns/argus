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

router.get('/organizations/:id', async (req, res, next) => {
  const { id } = req.params;

  let organization = await models.organization.findOne({ _id: id });
  res.json(organization)
});

router.get('/issues', async (req, res, next) => {
  let issues = await models.issue.find();
  res.json(issues);
});

router.get('/issues/:id', async (req, res, next) => {
  const { id } = req.params;

  let issue = await models.issue.findOne({ _id: id });
  res.json(issue);
});

router.get('*', async (req, res, next) => {
  res.sendStatus(404);
});

module.exports = router;
