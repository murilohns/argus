var conn = require('./mongo');
var models = require('../models');

const find = (query) => organizations.findOne(query);

const findAll = () => {
  return models.Organization.find();
};

const findAllIssues = async (id, params) => {
  let repositories = await models.Repository.find({ ownerId: id });

  const query = {
    repositoryId: { $in: repositories }
  };

  if(params.status) {
    query.state = params.status.toUpperCase()
  }

  let issues = await models.Issue.find(query).sort('-createdAt').limit(Number(params.count));

  let parsed_issues = issues.map( async issue => {
    issue = issue.toObject();

    issue.assignees = await models.User.find({ _id: { $in: issue.assignees } });
    issue.author = await models.User.findOne({ _id: issue.authorId });
    issue.repository = await models.Repository.findOne({ _id: issue.repositoryId });

    delete issue.authorId;
    delete issue.repositoryId;

    return issue;
  });

  return Promise.all(parsed_issues);
};

const findAllPullrequests = async (id, params) => {
  let repositories = await models.Repository.find({ ownerId: id }, { id: 1 });
  let repositoriesIds = repositories.map( repo => repo._id );

  let pullRequests = await models.PullRequest.find({ repositoryId: { $in: repositoriesIds } });

  return pullRequests;
};

module.exports = {
  find,
  findAll,
  findAllIssues,
  findAllPullrequests
};
