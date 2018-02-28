let chai = require('chai');
let chaiHttp = require('chai-http');
let mongoose = require('mongoose');

let server = require('../index');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Api', () => {

  it('should return status', async () => {

    let response = await chai.request(server)
    .get('/status')
    .send();

    expect(response).to.have.status(200);
  });

});
