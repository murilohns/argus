/* eslint-env node, mocha */
let chai = require('chai');
let chaiHttp = require('chai-http');
let mongoose = require('mongoose');
let Mongo = require('../database/connection');

let server = require('../index');

const {
  Organization,
  Repository,
  Issue
} = require('../database/models');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Organizations', () => {

  before( async function() {
    await Mongo().connect();
  });

  beforeEach( async function() {
    await Organization.remove({});
    await Repository.remove({});
    await Issue.remove({});
  });

  after( async function() {
    await Mongo().close();
  });

  it('should return all organizations', async function() {

    await new Organization({
      name: 'Test organization',
      login: 'testorg',
      githubId: '1'
    }).save();

    await new Organization({
      name: 'Another Test organization',
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

    let org = await new Organization({
      name: 'Test organization',
      login: 'testorg',
      githubId: '1'
    }).save();

    let response = await chai.request(server)
      .get(`/organizations/${org._id}`)
      .send();

    let json = JSON.parse(response.text);

    expect(response).to.have.status(200);
    expect(json).to.be.a('object');
    expect(json).to.have.property('name');
    expect(json).to.have.property('login');
    expect(json).to.have.property('githubId');
    expect(json).to.have.property('_id').eql(org.id);
  });

  it('should return organization by login', async function() {

    let org = await new Organization({
      name: 'Test organization',
      login: 'testorg',
      githubId: '1'
    }).save();

    await new Organization({
      name: 'Another Test organization',
      login: 'anothertestorg',
      githubId: '2'
    }).save();

    let response = await chai.request(server)
      .get(`/organizations?login=${org.login}`)
      .send();

    let json = JSON.parse(response.text);

    expect(response).to.have.status(200);
    expect(json).to.be.a('array');
    expect(json).to.have.lengthOf(1);
    expect(json[0]).to.have.property('_id').eql(org.id);
  });

  it('should return all organization issues', async function() {

    let org = await new Organization({
      name: 'Test organization',
      login: 'testorg',
      githubId: '1'
    }).save();

    let repo = await new Repository({
      githubId: '1',
      name: 'Test Repository',
      ownerModel: 'organization',
      ownerId: org.id,
      primaryLanguage: 'Javascript',
      url: 'https://www.github.com'
    }).save();

    await new Issue({
      githubId: '1',
      title: 'A dragon, I saw a dragon!',
      bodyText: 'What in oblivion is that?!',
      state: 'OPEN',
      url: 'https://www.github.com',
      createdAt: new Date(),
      authorId: mongoose.Types.ObjectId(),
      assignees: [ mongoose.Types.ObjectId() ],
      repositoryId: repo.id,
      commentsCount: 7
    }).save();

    await new Issue({
      githubId: '2',
      title: 'Oy!',
      bodyText: 'Ill drink from your skull!',
      state: 'CLOSED',
      url: 'https://www.github.com',
      createdAt: new Date(),
      authorId: mongoose.Types.ObjectId(),
      assignees: [ mongoose.Types.ObjectId() ],
      repositoryId: repo.id,
      commentsCount: 17
    }).save();

    let response = await chai.request(server)
      .get(`/organizations/${org.id}/issues`)
      .send();

    let json = JSON.parse(response.text);

    expect(response).to.have.status(200);
    expect(json).to.be.a('array');
    expect(json).to.have.lengthOf(2);
  });

  it('should return all organization repositories', async function() {

    let org = await new Organization({
      name: 'Test organization',
      login: 'testorg',
      githubId: '1'
    }).save();

    let repo = await new Repository({
      githubId: '1',
      name: 'Test Repository',
      ownerModel: 'organization',
      ownerId: org.id,
      primaryLanguage: 'Javascript',
      url: 'https://www.github.com'
    }).save();

    let response = await chai.request(server)
      .get(`/organizations/${org.id}/repositories`)
      .send();

    let json = JSON.parse(response.text);

    expect(response).to.have.status(200);
    expect(json).to.be.a('array');
    expect(json).to.have.lengthOf(1);
    expect(json[0]).to.have.property('_id').eql(repo.id);
  });

});
