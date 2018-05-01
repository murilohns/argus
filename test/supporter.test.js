/* eslint-env node, mocha */
let chai = require('chai');
let chaiHttp = require('chai-http');
let bcrypt = require('bcrypt');
let nock = require('nock');

let server = require('../index');

const {
  Supporter
} = require('../database/models');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Supporters', () => {

  beforeEach( async function() {
    await Supporter.remove({});
  });

  it('should return all supporters', async function() {

    await new Supporter({
      name: 'Saitama',
      user: 'capedbaldy',
      email: 'saitama@capedbaldy.com',
      slack_id: '1',
      password: '123'
    }).save();

    await new Supporter({
      name: 'Genos',
      user: 'demoncyborg',
      email: 'genos@cyborg.com',
      slack_id: '2',
      password: '123'
    }).save();

    let response = await chai.request(server)
      .get('/supporters')
      .send();

    let json = JSON.parse(response.text);

    expect(response).to.have.status(200);
    expect(json).to.be.a('array');
    expect(json).to.have.lengthOf(2);
  });

  it('should return one supporter', async function() {

    let sup = await new Supporter({
      name: 'Saitama',
      user: 'capedbaldy',
      email: 'saitama@capedbaldy.com',
      slack_id: '1',
      password: '123'
    }).save();

    let response = await chai.request(server)
      .get(`/supporters/${sup._id}`)
      .send();

    let json = JSON.parse(response.text);

    expect(response).to.have.status(200);
    expect(json).to.be.a('object');
    expect(json).to.have.property('_id').eql(sup.id);
    expect(json).to.not.have.property('password');
  });

  it('should authenticate with correct credentials', async function() {
    let password = await bcrypt.hash('123', 10);

    let sup = await new Supporter({
      name: 'Saitama',
      user: 'capedbaldy',
      email: 'saitama@capedbaldy.com',
      slack_id: '1',
      password: password
    }).save();

    let request = await chai.request(server)
      .post('/supporters/login')
      .send({ 'user': 'capedbaldy', 'password': '123' });

    let json = JSON.parse(request.text);

    expect(request).to.have.status(200);
    expect(json).to.be.a('object');
    expect(json).to.have.property('_id').eql(sup.id);
  });

  it('should not authenticate with wrong credentials', async function() {
    let password = await bcrypt.hash('123', 10);

    await new Supporter({
      name: 'Saitama',
      user: 'capedbaldy',
      email: 'saitama@capedbaldy.com',
      slack_id: '1',
      password: password
    }).save();

    let request = await chai.request(server)
      .post('/supporters/login')
      .send({ 'user': 'capedbaldy', 'password': 'wrongpassword' });

    let json = JSON.parse(request.text);

    expect(request).to.have.status(200);
    expect(json).to.be.a('string');
    expect(json).to.equal('Wrong username or password');
  });

  it('should register supporter', async function() {
    const user = { 
      name: 'Test User', 
      user: 'testuser',
      email: 'test@email.com',
      password: '123' 
    };

    nock('https://slack.com')
      .post('/api/users.lookupByEmail')
      .reply(200, {
        ok: true,
        user: {
          id: 1
        }
      });

    let request = await chai.request(server)
      .post('/supporters/register')
      .send(user);

    let json = JSON.parse(request.text);

    expect(request).to.have.status(200);
    expect(json).to.have.property('user').eql(user.user);
  });

  it('should not register supporter without slack id', async function() {
    const user = {
      name: 'Saitama',
      user: 'capedbaldy',
      email: 'saitama@capedbaldy.com',
      slack_id: '1',
      password: '123'
    };

    nock('https://slack.com')
      .post('/api/users.lookupByEmail')
      .reply(200, {
        ok: false,
        error: 'users_not_found'
      });

    let request = await chai.request(server)
      .post('/supporters/register')
      .send(user);

    expect(request).to.have.status(403);
    expect(request.text).eql('Slack user not found');
  });

});
