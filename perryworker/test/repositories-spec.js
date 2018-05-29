require('babel-polyfill');
require('babel-core/register');
require('co-mocha');
const assert = require('assert');
const requests = require('../src/requests').default;

describe('repositories requests', function() {
  this.timeout(10000);

  it('should return organization repositories', function() {
    return requests.repositories.find({ organization: 'pagarme' })
    .then( apiData => {
      const organization = apiData.data.organization;

      assert.equal(organization.login, 'pagarme');

      assert.notEqual(organization.repositories.nodes.length, 0);
    });

  });

  it('should return specific repository', function() {
    return requests.repositories.find({
      organization: 'pagarme', name: 'pagarme-js'
    }).then( apiData => {
      const organization = apiData.data.organization;

      assert.equal(organization.login, 'pagarme');

      const repository = organization.repository;

      assert.equal(repository.name, 'pagarme-js');
    });

  });

});
