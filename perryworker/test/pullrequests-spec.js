require('babel-polyfill');
require('babel-core/register');
require('co-mocha');
const assert = require('assert');
const requests = require('../src/requests').default;

describe('pullRequests requests', function() {
  this.timeout(10000);

  it('should return organization pullrequests', function() {
    return requests.pullrequests.fromOrganization('pagarme')
    .then( apiData => {
      const organization = apiData.data.organization;

      assert.equal(organization.login, 'pagarme');

      let pullrequestsCount = 0;
      organization.repositories.nodes.forEach( repository => {
        pullrequestsCount += repository.pullRequests.nodes.length;
      });

      assert.notEqual(pullrequestsCount, 0);
    });

  });

});
