var express = require('express');
var router = express.Router();
var Promise = require('bluebird');

var controllers = require('../controllers');

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

router.get('/repositories', (req, res, next) => {
  controllers.repositories.findAll()
  .then( repos => {
    res.send( JSON.stringify(repos) );
  });
});

router.get('/issues', (req, res, next) => {
  res.send('issues');
});

router.get('/pullrequests', (req, res, next) => {
  res.send('pullrequests');
});

router.get('/users', (req, res, next) => {
  res.send('users');
});

router.get('/supporters', (req, res, next) => {
  res.send('supporters');
});

module.exports = router;
