require('babel-polyfill');
require('babel-core/register');
require('co-mocha');
const assert = require('assert');
const requests = require('../src/requests').default;


describe('issues requests', function() {
  this.timeout(10000);

  it('should return organization issues', function () {
    return requests.issues.findFromOrganization('pagarme', 'OPEN')
    .then( apiData => {
      const organization = apiData.data.organization;

      assert.equal(organization.login, 'pagarme');

      let issuesCount = 0;
      organization.repositories.nodes.forEach( repository => {
        issuesCount += repository.issues.nodes.length;
      });

      assert.notEqual(issuesCount, 0);
    })
  });

});
