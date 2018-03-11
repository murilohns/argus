/* eslint-env node, mocha */
let chai = require('chai');
let chaiHttp = require('chai-http');
let mongoose = require('mongoose');

const expect = chai.expect;
chai.use(chaiHttp);

let server = require('../index');

const {
  Organization,
  Repository
} = require('../database/models');

describe('Repositories', function() {

  beforeEach( async function() {
    await Organization.remove({});
    await Repository.remove({});
  });

  it('should return all repositories', async function() {

    await new Repository({
      githubId: '1',
      name: 'Test Repository',
      ownerModel: 'organization',
      ownerId: mongoose.Types.ObjectId(),
      primaryLanguage: 'Javascript',
      url: 'https://www.github.com'
    }).save();

    await new Repository({
      githubId: '2',
      name: 'Another Test Repository',
      ownerModel: 'organization',
      ownerId: mongoose.Types.ObjectId(),
      primaryLanguage: 'HTML',
      url: 'https://www.github.com'
    }).save();

    let request = await chai.request(server)
      .get('/repositories')
      .send();

    let json = JSON.parse(request.text);

    expect(request).to.have.status(200);
    expect(json).to.be.a('array');
    expect(json).to.have.lengthOf(2);
  });

  it('should return one repository', async function() {

    let repo = await new Repository({
      githubId: '1',
      name: 'Test Repository',
      ownerModel: 'organization',
      ownerId: mongoose.Types.ObjectId(),
      primaryLanguage: 'Javascript',
      url: 'https://www.github.com'
    }).save();

    let request = await chai.request(server)
      .get(`/repositories/${repo.id}`)
      .send();

    let json = JSON.parse(request.text);

    expect(request).to.have.status(200);
    expect(json).to.be.a('object');
    expect(json).to.have.property('_id').eql(repo.id);
  });

  it('should return all organization\'s repositories', async function() {

    let org = await new Organization({
      githubId: '1',
      url: 'https://www.github.com',
      login: 'testorg',
      name: 'Test Organization'
    }).save();

    await new Repository({
      githubId: '1',
      name: 'Test Repository',
      ownerModel: 'organization',
      ownerId: org._id,
      primaryLanguage: 'Javascript',
      url: 'https://www.github.com'
    }).save();

    let request = await chai.request(server)
      .get(`/repositories?organization=${org.login}`)
      .send();

    let json = JSON.parse(request.text);

    expect(request).to.have.status(200);
    expect(json).to.be.a('array');
    expect(json).to.have.lengthOf(1);
  });

});
