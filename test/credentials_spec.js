const helper = require('node-red-node-test-helper');
const credentialsNode = require('../src/credentials/credentials');

describe('Credentials Node', () => {

  const credentials = {
    n1: {
      email: 'dummy@dummy.tld',
      password: 'abcd',
      region: 'eu'
    }
  };

  beforeEach(done => {
    helper.startServer(done);
  });

  afterEach(done => {
    helper.unload().then(() => {
      helper.stopServer(done);
    });
  });

  it('should be loaded', done => {
    var flow = [{ id: 'n1', type: 'ewelink-credentials' }];
    helper.load(credentialsNode, flow, credentials, () => {
      var n1 = helper.getNode('n1');

      n1.credentials.should.have.property('email', 'dummy@dummy.tld');
      n1.credentials.should.have.property('password', 'abcd');
      n1.credentials.should.have.property('region', 'eu');
      
      done();
    });
  });

  it('should unpack credentials', done => {
    var flow = [{ id: 'n1', type: 'ewelink-credentials' }];
    helper.load(credentialsNode, flow, credentials, () => {
      var n1 = helper.getNode('n1');

      n1.should.have.property('email', 'dummy@dummy.tld');
      n1.should.have.property('password', 'abcd');
      n1.should.have.property('region', 'eu');
      
      done();
    });
  });
});
