import promise from 'request-promise';
import config from '../config.js';
import queries from '../queries.js';
import Sieve from '../sieve';

function Issues() {

  return {
    findFromOrganization: (organizationLogin, states) => {

      const options = {
        method: 'POST',
        uri: config.get('github.url'),
        headers: {
          'User-Agent': 'perryworker',
          'Authorization': `bearer ${config.get('github.token')}`
        },
        body: {
          query: queries.issues.company,
          variables: { "organization": organizationLogin, "status": states }
        },
        json: true
      }

      return promise(options);

    },
    findRelated: function(term) {

      const options = {
        method: 'POST',
        uri: config.get('github.url'),
        headers: {
          'User-Agent': 'perryworker',
          'Authorization': `bearer ${config.get('github.token')}`
        },
        body: {
          query: queries.issues.related,
          variables: { "term": term }
        },
        json: true
      }

      return promise(options)
      .then( foundIssues => {
        foundIssues = foundIssues.data.search.nodes;

        let filteredIssues = Sieve({
          whitelist: ['Issue'],
          itemsToFilter: foundIssues
        }, issue => issue.__typename ).mitigate();

        filteredIssues = Sieve({
          blacklist: ['pagarme'],
          itemsToFilter: filteredIssues
        }, issue => issue.repository.owner.login ).mitigate();

        return filteredIssues;
      });
    }
  }
}

export default Issues;
