var conn = require('./mongo');
var organizations = require('../models/organization');

const find = (query) => organizations.findOne(query);

const findAll = () => {
  return organizations.find();
};

module.exports = {
  find,
  findAll
};
