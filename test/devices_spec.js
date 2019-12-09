const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const helper = require('node-red-node-test-helper');
const credentialsNode = require('../src/credentials/credentials');
const devicesNode = require('../src/devices/devices');
const eWeLinkConnect = require('../src/utils/ewelink-connect');

describe('Devices Node', () => {

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
      { id: 'n2', type: 'ewelink-devices', auth: 'n1', name: 'Devices Node 123' }
    ];
    helper.load([credentialsNode, devicesNode], flow, () => {
      const n2 = helper.getNode('n2');

      n2.should.have.property('name', 'Devices Node 123');
      
      done();
    });
  });

  it('should return the devices', done => {
    const connection = { getDevices() { } };
    
    const getDevicesStub = sinon.stub(connection, 'getDevices')
      .callsFake(() => Promise.resolve({ devices: 'great' }));

    const loginStub = sinon.stub(eWeLinkConnect, 'login')
      .callsFake(() => Promise.resolve(connection));

    const flow = [
      { id: 'n1', type: 'ewelink-credentials' },
      { id: 'n2', type: 'ewelink-devices', auth: 'n1', wires: [['n4']] },
      { id: 'n3', type: 'helper', wires: [['n2']] },
      { id: 'n4', type: 'helper' }
    ];
    helper.load([credentialsNode, devicesNode], flow, () => {
      const n2 = helper.getNode('n2');
      const n3 = helper.getNode('n3');
      const n4 = helper.getNode('n4');

      setTimeout(() => {
        n2.on('input', () => {
          sinon.assert.calledOnce(getDevicesStub);
          sinon.assert.calledOnce(loginStub);

          getDevicesStub.restore();
          loginStub.restore();

          n4.on('input', msg => {
            expect(msg).to.deep.include({ payload: { devices: 'great' } });

            done();
          });
        });

        n3.send({ payload: null });
      });
    });
  });
});
