let express = require('express');
let router = express.Router();
let bcrypt = require('bcrypt');

let controllers = require('../controllers');

const {
  removeNullProperties
} = require('./requestHelpers');

router.get('/status', (req, res) => {
  res.send('I\'m alive!');
});

router.get('/organizations', async (req, res) => {
  let organizations = await controllers.organization.find(req.query);
  res.json(organizations);
});

router.get('/organizations/:id', async (req, res) => {
  const { id } = req.params;

  let organization = await controllers.organization.findOne({ _id: id });
  res.json(organization);
});

router.get('/organizations/:id/issues', async (req, res) => {
  const { id } = req.params;
  let issues = await controllers.organization.findIssues(id);
  res.json(issues);
});

router.get('/issues', async (req, res) => {
  let { repository, state } = req.query;

  let query = {
    repositoryId: repository? await controllers.repository.findOne({ name: repository }).then( repo => repo._id ) : null,
    state: state || null
  };

  query = removeNullProperties(query);

  let issues = await controllers.issue.find(query);
  res.json(issues);
});

router.get('/issues/:id', async (req, res) => {
  const { id } = req.params;

  let issue = await controllers.issue.findOne({ _id: id });
  res.json(issue);
});

router.put('/issues/:id/assign', async (req, res) => {
  const { id } = req.params;
  const { supporter } = req.body;

  let issue = await controllers.issue.update({ _id: id }, { assignedSupporter: supporter });
  res.json(issue);
});

router.get('/repositories', async (req, res) => {
  let { organization } = req.query;

  let query = {
    ownerId: organization? await controllers.organization.findOne(
      { login: organization }
    ).then( res => res._id ) : null
  };

  query = removeNullProperties(query);

  let repositories = await controllers.repository.find(query);
  res.json(repositories);
});

router.get('/repositories/:id', async (req, res) => {
  const { id } = req.params;

  let repositories = await controllers.repository.findOne({ _id: id });
  res.json(repositories);
});

router.get('/supporters', async (req, res) => {
  let supporters = await controllers.supporter.find();
  supporters = supporters.map( supporter => controllers.supporter.removePassword(supporter) );
  res.json(supporters);
});

router.get('/supporters/:id', async (req, res) => {
  const { id } = req.params;

  let supporter = await controllers.supporter.findOne({ _id: id });
  supporter = controllers.supporter.removePassword(supporter);
  res.json(supporter);
});

router.post('/supporters/login', async (req, res) => {
  const { user, password } = req.body;

  let supporter = await controllers.supporter.findOne({ user: user });

  let response = 'Wrong username or password';
  if( supporter !== null ) {
    let isCorrectPassword = await bcrypt.compare(password, supporter.password);
    supporter = controllers.supporter.removePassword(supporter);
    response = isCorrectPassword? supporter : response;
  }

  res.json(response);
});

router.post('/supporters/register', async (req, res) => {
  const { name, user, password } = req.body;
  let encryptedPassword = await bcrypt.hash(password, 10);

  let supporter = await controllers.supporter.save({ name, user, password: encryptedPassword });
  supporter = controllers.supporter.removePassword(supporter);
  res.json(supporter);
});

router.get('*', async (req, res) => {
  res.sendStatus(404);
});

module.exports = router;
