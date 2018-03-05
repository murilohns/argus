const {
  connectionManager
} = require('../database/helpers');

const {
  Repository
} = require('../database/models');

const find = connectionManager(async query => {
  let repositories = await Repository.find(query);
  return repositories;
});

const findOne = connectionManager(async query => {
  let repository = await Repository.findOne(query);
  return repository;
});

module.exports = {
  find,
  findOne
};
