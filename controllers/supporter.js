const {
  Supporter
} = require('../database/models');

const slack = require('../helpers/slack');

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
  let slack_id = await slack.findIdByEmail(query.email);

  if(slack_id.ok === false && slack_id.error === 'users_not_found') {
    return {
      status: 403,
      data: 'Slack user not found'
    }
  }

  query.slack_id = slack_id;

  let supporter = await new Supporter(query).save();
  return {
    status: 200,
    data: supporter
  };
};

module.exports = {
  find,
  findOne,
  removePassword,
  save
};
