let chai = require('chai');
let chaiHttp = require('chai-http');
let mongoose = require('mongoose');

let server = require('../index');

let Organization = require('../models/organization');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Organizations', () => {

  beforeEach( async function() {
    await Organization.remove({});
  });

  it('should return all organizations', async function() {

    await new Organization({
      name: 'Test Organization',
      login: 'testorg',
      githubId: '1'
    }).save();

    await new Organization({
      name: 'Another Test Organization',
      login: 'anothertestorg',
      githubId: '2'
    }).save();

    let response = await chai.request(server)
    .get('/organizations')
    .send();

    let json = JSON.parse(response.text);

    expect(response).to.have.status(200);
    expect(json).to.be.an('Array');
    expect(json).to.have.lengthOf(2);
  });

  it('should return one organization', async function() {

    let organization = await new Organization({
      name: 'Test Organization',
      login: 'testorg',
      githubId: '1'
    }).save();

    let response = await chai.request(server)
    .get(`/organizations/${organization._id}`)
    .send();

    let json = JSON.parse(response.text);

    expect(response).to.have.status(200);
    expect(json).to.be.a('object');
    expect(json).to.have.property('name');
    expect(json).to.have.property('login');
    expect(json).to.have.property('githubId');
    expect(json).to.have.property('_id').eql(organization.id);
  });

});
