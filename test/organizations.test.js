process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let mongoose = require('mongoose');

let server = require('../index');

let Organization = require('../models/organization');

let should = chai.should();
chai.use(chaiHttp);

describe('Organizations', () => {

  it('should get all organizations', (done) => {
    chai.request(server)
      .get('/organizations')
      .end((err, res) => {
          res.should.have.status(200);
          JSON.parse(res.text).should.be.a('array');
        done();
      });
  });

  it('should get all issues from a organization', done => {

    chai.request(server)
    .get('/organizations')
    .end( (err, organizations) => {
      let pagarme = JSON.parse(organizations.text)[0];

      chai.request(server)
      .get(`/organizations/${pagarme._id}/issues`)
      .end( (err, issues) => {
        issues = JSON.parse(issues.text);
        issues.should.be.a('array');
        done();
      });

    });

  });

});
