const { WebClient } = require('@slack/client');
require('dotenv').config();
const token = process.env.SLACK_API_TOKEN;

const web = new WebClient(token);

const findIdByEmail = (email) =>
  web.users.lookupByEmail({ email: email })
    .then( res => res.user.id )
    .catch( err => err.data );

module.exports = {
  findIdByEmail
};
