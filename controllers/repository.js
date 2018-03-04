const {
  Repository
} = require('../models');

const find = async query => {
  let repositories = await Repository.find(query);
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
