const Mongo = require('../database/connection');

const {
  Repository
} = require('../database/models');

const find = async query => {
  Mongo().connect();
  let repositories = await Repository.find(query);
  Mongo().close();
  return repositories;
};

const findOne = async query => {
  Mongo().connect();
  let repository = await Repository.findOne(query);
  Mongo().close();
  return repository;
};

module.exports = {
  find,
  findOne
};
