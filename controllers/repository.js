const {
  Repository,
  Issue
} = require('../database/models');

const find = async query => {
  let repositories = await Repository.find(query);
  let issuesPromises = repositories.map( async repository => {
    repository = repository.toObject();

    repository.issues = await Issue.find({ repositoryId: repository._id });
    return repository;
  });

  repositories = Promise.all(issuesPromises);
  return repositories;
};

const findOne = async query => {
  let repository = await Repository.findOne(query);
  return repository;
};

module.exports = {
  find,
  findOne
};
