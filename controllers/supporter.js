const Mongo = require('../database/connection');

const {
  Supporter
} = require('../database/models');

const removePassword = supporter => {
  supporter = supporter.toObject();
  delete supporter.password;
  return supporter;
};

const find = async query => {
  Mongo().connect();
  let supporters = await Supporter.find(query);
  Mongo().close();
  return supporters;
};

const findOne = async query => {
  Mongo().connect();
  let supporter = await Supporter.findOne(query);
  Mongo().close();
  return supporter;
};

module.exports = {
  find,
  findOne,
  removePassword
};
