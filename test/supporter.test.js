/* eslint-env node, mocha */
let chai = require('chai');
let chaiHttp = require('chai-http');
let Mongo = require('../database/connection');
let bcrypt = require('bcrypt');

let server = require('../index');

const {
  Supporter
} = require('../database/models');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Supporters', () => {

  beforeEach( async function() {
    await Mongo().connect();

    await Supporter.remove({});
  });

  afterEach( async function() {
    await Mongo().close();
  });

  it('should return all supporters', async function() {

    await new Supporter({
      name: 'Saitama',
      user: 'capedbaldy',
      password: '123'
    }).save();

    await new Supporter({
      name: 'Genos',
      user: 'demoncyborg',
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

});
