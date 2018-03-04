const {
  Issue
} = require('../models');

const find = async query => {
  let issues = await Issue.find(query);
  return issues;
};

const findOne = async query => {
  let issue = await Issue.findOne(query);
  return issue;
};

module.exports = {
  find,
  findOne
};
