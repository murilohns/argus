import convict from 'convict';
require('dotenv').load();

const config = convict({
  github: {
    doc: "Github V4 API",
    url: "https://api.github.com/graphql",
    token: {
      default: 'Github',
      doc: 'The github API token.',
      format: String,
      env: 'GITHUB_API_TOKEN',
    }
  },
  mongo: {
    url: {
      doc: 'Host for mongo connection',
      format: '*',
      env: 'MONGO_URL',
      default: 'Mongo Database'
    }
  }
});

export default config;
