var conn = require('./mongo');
var repositories = require('../models/repository');

const findAll = () => {
  return repositories.find();
};

const find = (query) => repositories.find(query);

module.exports = {
  find,
  findAll
};
