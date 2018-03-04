/* eslint-env node, mocha */
let chai = require('chai');
let chaiHttp = require('chai-http');

let server = require('../index');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Api', () => {

  it('should return connection status', async function() {

    let response = await chai.request(server)
      .get('/status')
      .send();

    expect(response).to.have.status(200);
  });

  it('should return 404 for undefined route', (done) => {

    chai.request(server)
      .get('/what-in-oblivion-is-that')
      .end( res => {
        expect(res).to.have.status(404);
        done();
      });

  });

});
