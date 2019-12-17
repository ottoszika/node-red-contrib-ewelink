const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const helper = require('node-red-node-test-helper');
const credentialsNode = require('../src/credentials/credentials');
const channelCountNode = require('../src/channel-count/channel-count');
const eWeLinkConnect = require('../src/utils/ewelink-connect');

describe('Channel Count Node', () => {

  beforeEach(done => {
    helper.startServer(done);
  });

  afterEach(done => {
    helper.unload().then(() => {
      helper.stopServer(done);
    });
  });

  it('should be loaded', done => {
    const flow = [
      { id: 'n1', type: 'ewelink-credentials' },
      { id: 'n2', type: 'ewelink-channel-count', auth: 'n1', deviceId: '12345', name: 'Device 123' }
    ];
    helper.load([credentialsNode, channelCountNode], flow, () => {
      const n2 = helper.getNode('n2');

      n2.should.have.property('name', 'Device 123');
      
      done();
    });
  });

  it('should return the result of the getDeviceChannelCount call', done => {
    const connection = { getDeviceChannelCount() { } };
    
    const methodStub = sinon.stub(connection, 'getDeviceChannelCount')
      .callsFake(() => Promise.resolve({ methodResult: 'great' }));

    const readyStub = sinon.stub(eWeLinkConnect, 'ready')
      .callsFake(() => Promise.resolve(connection));

    const flow = [
      { id: 'n1', type: 'ewelink-credentials' },
      { id: 'n2', type: 'ewelink-channel-count', auth: 'n1', deviceId: '12345', wires: [['n4']] },
      { id: 'n3', type: 'helper', wires: [['n2']] },
      { id: 'n4', type: 'helper' }
    ];
    helper.load([credentialsNode, channelCountNode], flow, () => {
      const n2 = helper.getNode('n2');
      const n3 = helper.getNode('n3');
      const n4 = helper.getNode('n4');

      setTimeout(() => {
        n2.on('input', () => {
          sinon.assert.calledWith(methodStub, '12345');
          sinon.assert.calledOnce(readyStub);

          methodStub.restore();
          readyStub.restore();

          n4.on('input', msg => {
            expect(msg).to.deep.include({ payload: { methodResult: 'great' } });

            done();
          });
        });

        n3.send({ payload: '' });
      });
    });
  });
});
