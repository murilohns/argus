/* eslint-env node, mocha */
let chai = require('chai');
let chaiHttp = require('chai-http');
let mongoose = require('mongoose');

let server = require('../index');

let {
  Repository,
  Issue,
  Comment,
  Supporter
} = require('../database/models');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Issues', () => {

  beforeEach( async function() {
    await Repository.remove({});
    await Issue.remove({});
    await Comment.remove({});
    await Supporter.remove({});
  });

  it('should return all issues', async function() {

    let issueWithComment = await new Issue({
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

    await new Comment({
      githubId: '1',
      bodyText: 'I used to be an adventurer like you, then I took an arrow in the knee.',
      author: mongoose.Types.ObjectId(),
      model: 'issue',
      modelId: issueWithComment._id
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

  it('should return all repository\'s issues', async function() {

    let repo = await new Repository({
      githubId: '1',
      name: 'testrepo',
      ownerModel: 'organization',
      ownerId: mongoose.Types.ObjectId(),
      primaryLanguage: 'Javascript',
      url: 'https://www.github.com'
    }).save();

    await new Issue({
      githubId: '1',
      title: 'Test Issue',
      bodyText: 'What in oblivion is that?!',
      state: 'OPEN',
      url: 'https://www.github.com',
      createdAt: new Date(),
      authorId: mongoose.Types.ObjectId(),
      assignees: [ mongoose.Types.ObjectId() ],
      repositoryId: repo.id,
      commentsCount: 7
    }).save();

    let request = await chai.request(server)
      .get(`/issues?repository=${repo.name}`)
      .send();

    let json = JSON.parse(request.text);

    expect(request).to.have.status(200);
    expect(json).to.be.a('array');
    expect(json).to.have.lengthOf(1);
  });

  it('should return open issues only', async function() {

    await new Issue({
      githubId: '1',
      title: 'Open Issue',
      bodyText: 'Description...',
      state: 'OPEN',
      url: 'https://www.github.com',
      createdAt: new Date(),
      authorId: mongoose.Types.ObjectId(),
      assignees: [ mongoose.Types.ObjectId() ],
      repositoryId: mongoose.Types.ObjectId(),
      commentsCount: 17
    }).save();

    await new Issue({
      githubId: '2',
      title: 'Closed Issue',
      bodyText: 'Description...',
      state: 'CLOSED',
      url: 'https://www.github.com',
      createdAt: new Date(),
      authorId: mongoose.Types.ObjectId(),
      assignees: [ mongoose.Types.ObjectId() ],
      repositoryId: mongoose.Types.ObjectId(),
      commentsCount: 7
    }).save();

    let request = await chai.request(server)
      .get('/issues?state=OPEN')
      .send();

    let json = JSON.parse(request.text);

    expect(request).to.have.status(200);
    expect(json).to.be.a('array');
    expect(json).to.have.lengthOf(1);
    expect(json[0]).to.have.property('state').eql('OPEN');
  });

  it('should assign supporter to issue', async function() {

    let supporter = await new Supporter({
      name: 'Test User',
      user: 'testuser',
      password: '123'
    }).save();

    let issue = await new Issue({
      githubId: '1',
      title: 'Closed Issue',
      bodyText: 'Description...',
      state: 'CLOSED',
      url: 'https://www.github.com',
      createdAt: new Date(),
      authorId: mongoose.Types.ObjectId(),
      assignees: [ mongoose.Types.ObjectId() ],
      repositoryId: mongoose.Types.ObjectId(),
      commentsCount: 7
    }).save();

    let request = await chai.request(server)
      .put(`/issues/${issue.id}/assign`)
      .send({ supporter: supporter._id });

    let json = JSON.parse(request.text);

    expect(request).to.have.status(200);
    expect(json).to.be.a('object');
    expect(json).to.have.property('_id').eql(issue.id);
    expect(json).to.have.property('assignedSupporter').eql(supporter.id);
  });

});
