let express = require('express');
let router = express.Router();
let bcrypt = require('bcrypt');

let controllers = require('../controllers');

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

router.get('/organizations/:id/repositories', async (req, res) => {
  const { id } = req.params;
  let repositories = await controllers.repository.find({ ownerId: id });
  res.json(repositories);
});

router.get('/issues', async (req, res) => {
  let issues = await controllers.issue.find(req.query);
  res.json(issues);
});

router.get('/issues/:id', async (req, res) => {
  const { id } = req.params;

  let issue = await controllers.issue.findOne({ _id: id });
  res.json(issue);
});

router.get('/repositories', async (req, res) => {
  let repositories = await controllers.repository.find();
  res.json(repositories);
});

router.get('/repositories/:id', async (req, res) => {
  const { id } = req.params;

  let repositories = await controllers.repository.findOne({ _id: id });
  res.json(repositories);
});

router.get('/supporters', async (req, res) => {
  let supporters = await controllers.supporter.find();
  res.json(supporters);
});

router.get('/supporters/:id', async (req, res) => {
  const { id } = req.params;

  let supporter = await controllers.supporter.findOne({ _id: id });
  res.json(supporter);
});

router.post('/supporters/login', async (req, res) => {
  const { user, password } = req.body;

  let supporter = await controllers.supporter.findOne({ user: user });
  let authenticate = await bcrypt.compare(password, supporter.password);

  supporter = supporter.toObject();
  delete supporter.password;
  let response = authenticate? supporter : 'Wrong username or password';

  res.json(response);
});

router.get('*', async (req, res) => {
  res.sendStatus(404);
});

module.exports = router;
