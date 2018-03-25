const {
  Supporter
} = require('../database/models');

const removePassword = supporter => {
  supporter = supporter.toObject();
  delete supporter.password;
  return supporter;
};

const find = async query => {
  let supporters = await Supporter.find(query);
  return supporters;
};

const findOne = async query => {
  let supporter = await Supporter.findOne(query);
  return supporter;
};

const save = async query => {
  let supporter = await new Supporter(query).save();
  return supporter;
};

module.exports = {
  find,
  findOne,
  removePassword,
  save
};
