import promise from 'request-promise';
import config from '../config.js';
import queries from '../queries.js';

function Repositories() {

  function findAll(opts) {

    const options = {
      method: 'POST',
      uri: config.get('github.url'),
      headers: {
        'User-Agent': 'perryworker',
        'Authorization': `bearer ${config.get('github.token')}`
      },
      body: {
        query: queries.repositories.findAll,
        variables: { "organization": opts.organization }
      },
      json: true
    }

    return promise(options);
  }

  function findOne(opts) {

    const options = {
      method: 'POST',
      uri: config.get('github.url'),
      headers: {
        'User-Agent': 'perryworker',
        'Authorization': `bearer ${config.get('github.token')}`
      },
      body: {
        query: queries.repositories.findOne,
        variables: {
          "organization": opts.organization,
          "repository": opts.name
        }
      },
      json: true
    }

    return promise(options);
  }

  return {
    /**
      @param {object} opts
      @param {string} opts.name - Repository name
      @param {string} opts.organization - Repository's organization name
    */
    find: function(opts) {
      if( opts.name ) {
        return findOne(opts);
      }

      return findAll(opts);
    }
  };
}


export default Repositories;
