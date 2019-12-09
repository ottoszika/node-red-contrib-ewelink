const chai = require('chai');
const expect = chai.expect;
const spies = require('chai-spies');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const helper = require('node-red-node-test-helper');
const eWeLinkConnect = require('../src/utils/ewelink-connect');
const ewelink = require('ewelink-api');
const credentialsNode = require('../src/credentials/credentials');
const devicesNode = require('../src/devices/devices');

chai.use(spies);
chai.use(chaiAsPromised);

describe('eWeLink Connect Utils', () => {

  describe('#login()', () => {

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

    it('should throw an error when no credentials were set', done => {
      expect(() => eWeLinkConnect.login(helper._RED, {}, {})).to.throw('No credentials provided!');
      done();
    });

    it('should handle login rejection', (done) => {
      const flow = [
        { id: 'n1', type: 'ewelink-credentials' },
        { id: 'n2', type: 'ewelink-devices', auth: 'n1' }
      ];

      helper.load([credentialsNode, devicesNode], flow, credentials, () => {
        const n2 = helper.getNode('n2');

        const stub = sinon.stub(ewelink.prototype, 'login')
          .callsFake(() => Promise.reject({ somethingWentWrong: 'off...' }));

        expect(eWeLinkConnect.login(helper._RED, n2, { auth: 'n1' }))
          .to.be.rejectedWith({ somethingWentWrong: 'off...' });

        stub.restore();

        done();
      });
    });

    it('should handle login success but with error code', done => {
      const flow = [
        { id: 'n1', type: 'ewelink-credentials' },
        { id: 'n2', type: 'ewelink-devices', auth: 'n1' }
      ];
  
      helper.load([credentialsNode, devicesNode], flow, credentials, () => {
        const n2 = helper.getNode('n2');
  
        const stub = sinon.stub(ewelink.prototype, 'login')
          .callsFake(() => Promise.resolve({ error: 1234 }));
  
        expect(eWeLinkConnect.login(helper._RED, n2, { auth: 'n1' }))
          .to.be.rejectedWith({ error: 1234 });

        stub.restore();
  
        done();
      });
    });

    it('should return connection when login is successfully', done => {
      const flow = [
        { id: 'n1', type: 'ewelink-credentials' },
        { id: 'n2', type: 'ewelink-devices', auth: 'n1' }
      ];
  
      helper.load([credentialsNode, devicesNode], flow, credentials, () => {
        const n2 = helper.getNode('n2');
  
        const stub = sinon.stub(ewelink.prototype, 'login')
          .callsFake(() => Promise.resolve({ }));
  
        expect(eWeLinkConnect.login(helper._RED, n2, { auth: 'n1' }))
          .to.be.fulfilled.and.should.eventually.have.property('email');

        stub.restore();
  
        done();
      });
    });
  });

  describe('#setNodeStatusToConnecting()', () => {
    it('should set the correct node status', done => {
      const node = { status() { } };
      const spy = chai.spy.on(node, 'status');

      eWeLinkConnect.setNodeStatusToConnecting(node);

      expect(spy).to.have.been.called.with({ fill: 'yellow', shape: 'dot', text: 'connecting' });

      done();
    });
  });

  describe('#setNodeStatusToConnected()', () => {
    it('should set the correct node status', done => {
      const node = { status() { } };
      const spy = chai.spy.on(node, 'status');

      eWeLinkConnect.setNodeStatusToConnected(node);

      expect(spy).to.have.been.called.with({ fill: 'green', shape: 'dot', text: 'connected' });

      done();
    });
  });

  describe('#setNodeStatusToDisconnected()', () => {
    it('should set the correct node status', done => {
      const node = { status() { } };
      const spy = chai.spy.on(node, 'status');

      eWeLinkConnect.setNodeStatusToDisconnected(node);

      expect(spy).to.have.been.called.with({ fill: 'red', shape: 'dot', text: 'disconnected' });

      done();
    });
  });
});
