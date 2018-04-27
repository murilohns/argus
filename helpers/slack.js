const { WebClient } = require('@slack/client');
require('dotenv').config();
const token = process.env.SLACK_API_TOKEN;

const web = new WebClient(token);

const findIdByEmail = async (email) => {
  let slackUserId = web.users.lookupByEmail({ email: email })
    .then( res => res.user.id)
    .catch(err => err);

  return slackUserId;
};

module.exports = {
  findIdByEmail
};
