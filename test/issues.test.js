/* eslint-env node, mocha */
let chai = require('chai');
let chaiHttp = require('chai-http');
let mongoose = require('mongoose');
let Mongo = require('../database/connection');

let server = require('../index');

let {
  Issue
} = require('../database/models');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Issues', () => {

  before( async function() {
    await Mongo().connect();
  });

  beforeEach( async function() {
    await Issue.remove({});
  });

  after( async function() {
    await Mongo().close();
  });

  it('should return all issues', async function() {

    await new Issue({
      githubId: '1',
      title: 'Test Issue',
      bodyText: 'What in oblivion is that?!',
      state: 'OPEN',
      url: 'https://www.github.com',
      createdAt: new Date(),
      authorId: mongoose.Types.ObjectId(),
      assignees: [ mongoose.Types.ObjectId() ],
      repositoryId: mongoose.Types.ObjectId(),
      commentsCount: 7
    }).save();

    await new Issue({
      githubId: '2',
      title: 'Another Test Issue',
      bodyText: 'I used to be an adventurer like you, then I took an arrow in the knee.',
      state: 'CLOSED',
      url: 'https://www.github.com',
      createdAt: new Date(),
      authorId: mongoose.Types.ObjectId(),
      assignees: [ mongoose.Types.ObjectId() ],
      repositoryId: mongoose.Types.ObjectId(),
      commentsCount: 17
    }).save();

    let response = await chai.request(server)
      .get('/issues')
      .send();

    let json = JSON.parse(response.text);

    expect(json).to.be.an('Array');
    expect(json).to.have.lengthOf(2);
  });

  it('should return one issue', async function() {

    let issue = await new Issue({
      githubId: '1',
      title: 'Test Issue',
      bodyText: 'What in oblivion is that?!',
      state: 'OPEN',
      url: 'https://www.github.com',
      createdAt: new Date(),
      authorId: mongoose.Types.ObjectId(),
      assignees: [ mongoose.Types.ObjectId() ],
      repositoryId: mongoose.Types.ObjectId(),
      commentsCount: 7
    }).save();

    let response = await chai.request(server)
      .get(`/issues/${issue._id}`)
      .send();

    let json = JSON.parse(response.text);

    expect(response).to.have.status(200);
    expect(json).to.be.a('object');
    expect(json).to.have.property('githubId');
    expect(json).to.have.property('title');
    expect(json).to.have.property('bodyText');
    expect(json).to.have.property('state');
    expect(json).to.have.property('url');
    expect(json).to.have.property('createdAt');
    expect(json).to.have.property('authorId');
    expect(json).to.have.property('assignees');
    expect(json).to.have.property('repositoryId');
    expect(json).to.have.property('commentsCount');
    expect(json).to.have.property('_id').eql(issue.id);
  });

});
