process.env.NODE_ENV = 'test';
process.env.MONGO_URL = 'mongodb://localhost/testing';

let chai = require('chai');
let chaiHttp = require('chai-http');
let mongoose = require('mongoose');

let server = require('../index');

let Organization = require('../models/organization');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Organizations', () => {

  beforeEach( async function() {
    await Organization.remove();
  })

  // after( function(done) {
  //   mongoose.connection.close(done);
  // })

  it('should return all organizations', async function() {
    let organizations = [
      {
        name: 'Test organization',
        login: 'testorg',
        githubId: '1'
      },
      {
        name: 'Another one',
        login: 'anone',
        githubId: '2'
      }
    ];

    let promises = organizations.map(
      function(org) { return new Organization(org).save() }
    );

    await Promise.all(promises);

    let response = await chai.request(server)
    .get('/organizations')
    .send();

    let json = JSON.parse(response.text);

    expect(json).to.be.an('Array');
    expect(json).to.have.lengthOf(2);
  });

});
