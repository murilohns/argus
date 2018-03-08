const Promise = require('bluebird');
const Mongo = require('../database/connection');

const {
  Organization,
  Repository,
  Issue
} = require('../database/models');

const find = async query => {
  Mongo().connect();
  let organizations = await Organization.find(query);
  Mongo().close();
  return organizations;
};

const findOne = async query => {
  Mongo().connect();
  let organization = await Organization.findOne(query);
  Mongo().close();
  return organization;
};

const findIssues = async id => {
  Mongo().connect();
  let repositories = await Repository.find({ ownerId: id });
  let promises = repositories.map( repo => Issue.find({ repositoryId: repo._id }) );

  let issues = await Promise.all(promises);
  Mongo().close();
  issues = issues.reduce( (arr, row) => arr.concat(row) );

  return issues;
};

module.exports = {
  find,
  findOne,
  findIssues
};
