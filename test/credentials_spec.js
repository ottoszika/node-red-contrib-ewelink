var helper = require('node-red-node-test-helper');
var credentialsNode = require('../src/credentials/credentials');

describe('Credentials Node', function () {

  var credentials = {
    n1: {
      email: 'dummy@dummy.tld',
      password: 'abcd',
      region: 'eu'
    }
  };

  beforeEach(function (done) {
    helper.startServer(done);
  });

  afterEach(function (done) {
    helper.unload().then(function () {
      helper.stopServer(done);
    });
  });

  it('should be loaded', function (done) {
    var flow = [{ id: 'n1', type: 'ewelink-credentials' }];
    helper.load(credentialsNode, flow, credentials, function () {
      var n1 = helper.getNode('n1');

      n1.credentials.should.have.property('email', 'dummy@dummy.tld');
      n1.credentials.should.have.property('password', 'abcd');
      n1.credentials.should.have.property('region', 'eu');
      
      done();
    });
  });

  it('should unpack credentials', function (done) {
    var flow = [{ id: 'n1', type: 'ewelink-credentials' }];
    helper.load(credentialsNode, flow, credentials, function () {
      var n1 = helper.getNode('n1');

      n1.should.have.property('email', 'dummy@dummy.tld');
      n1.should.have.property('password', 'abcd');
      n1.should.have.property('region', 'eu');
      
      done();
    });
  });
});
