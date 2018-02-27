var express = require('express');
var router = express.Router();
var Promise = require('bluebird');

var controllers = require('../controllers');
var models = require('../models');

router.get('/organizations', (req, res, next) => {
  controllers.organizations.findAll()
  .then( orgs => {
    res.send( JSON.stringify(orgs) );
  });
});

router.get('/organizations/:ownerId/repositories', (req, res, next) => {
  const { ownerId } = req.params;

  Promise.all([
    controllers.organizations.find({ _id: ownerId }),
    controllers.repositories.find({ ownerId: ownerId })
  ]).spread( (organization, repositories) => {
    organization = organization.toObject();
    organization.repositories = repositories;
    res.send(JSON.stringify(organization));
  });

});

router.get('/organizations/:id/issues', async (req, res, next) => {
  const { id } = req.params;
  const { status, count } = req.query;

  let issues = await controllers.organizations.findAllIssues(id, req.query);

  res.json( issues );
});

router.get('/organizations/:id/pullrequests', async (req, res, next) => {
  const { id } = req.params;

  let pullrequests = await controllers.organizations.findAllPullrequests(id, req.query);

  res.json(pullrequests);
});

router.get('/repositories', (req, res, next) => {
  controllers.repositories.findAll()
  .then( repos => {
    res.send( JSON.stringify(repos) );
  });
});

router.get('/issues', (req, res, next) => {
  controllers.issues.findAll()
  .then( issues => {
    res.send( JSON.stringify(issues) );
  })
});

router.get('/pullrequests', (req, res, next) => {
  res.send('pullrequests');
});

router.get('/users', (req, res, next) => {
  res.send('users');
});

router.get('/supporters', async (req, res, next) => {
  let { name, user } = req.query;

  let query = {};

  if( name ) {
    query.name = name;
  }

  if( user ) {
    query.user = user;
  }

  const fields = { name: 1, user: 1 };
  var supporters = await models.Supporter.find(query, fields);
  res.json(supporters);
});

router.post('/login', async (req, res, next) => {
  const { user, password } = req.body;

  let supporter = await models.Supporter.findOne({ user: user });

  if( supporter.password === password ) {
    res.send( supporter._id );
  }

  res.send('ok');
});

module.exports = router;
