const Promise = require('bluebird');

const {
  Organization,
  Repository,
  Issue
} = require('../database/models');

const find = async query => {
  let organizations = await Organization.find(query);
  return organizations;
};

const findOne = async query => {
  let organization = await Organization.findOne(query);
  return organization;
};

const findIssues = async id => {
  let repositories = await Repository.find({ ownerId: id });
  let promises = repositories.map( repo => Issue.find({ repositoryId: repo._id }) );

  let issues = await Promise.all(promises);
  issues = issues.reduce( (arr, row) => arr.concat(row) );

  return issues;
};

module.exports = {
  find,
  findOne,
  findIssues
};
