const sinon = require('sinon');
const eWeLinkConnect = require('../src/utils/ewelink-connect');

describe('eWeLink Connect Utils', () => {

  describe('#setNodeStatusToConnecting()', () => {
    it('should set the correct node status', (done) => {
      const node = { status() { } };
      const spy = sinon.spy(node, 'status');

      eWeLinkConnect.setNodeStatusToConnecting(node);

      sinon.assert.calledWith(spy, { fill: 'yellow', shape: 'dot', text: 'connecting' });

      done();
    });
  });

  describe('#setNodeStatusToConnected()', () => {
    it('should set the correct node status', (done) => {
      const node = { status() { } };
      const spy = sinon.spy(node, 'status');

      eWeLinkConnect.setNodeStatusToConnected(node);

      sinon.assert.calledWith(spy, { fill: 'green', shape: 'dot', text: 'connected' });

      done();
    });
  });

  describe('#setNodeStatusToDisconnected()', () => {
    it('should set the correct node status', (done) => {
      const node = { status() { } };
      const spy = sinon.spy(node, 'status');

      eWeLinkConnect.setNodeStatusToDisconnected(node);

      sinon.assert.calledWith(spy, { fill: 'red', shape: 'dot', text: 'disconnected' });

      done();
    });
  });
});
