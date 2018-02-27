var conn = require('./mongo');
var issues = require('../models/issue');

const find = (query) => issues.findOne(query);

const findAll = (query) => issues.find;

module.exports = {
  find,
  findAll
};
