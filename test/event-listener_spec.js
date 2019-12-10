const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const helper = require('node-red-node-test-helper');
const credentialsNode = require('../src/credentials/credentials');
const eventListenerNode = require('../src/event-listener/event-listener');
const eWeLinkConnect = require('../src/utils/ewelink-connect');

describe('Event Listener Node', () => {

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
    const flow = [
      { id: 'n1', type: 'ewelink-credentials' },
      { id: 'n2', type: 'ewelink-event-listener', auth: 'n1', deviceId: '', name: 'Device 123' }
    ];
    helper.load([credentialsNode, eventListenerNode], flow, credentials, () => {
      const n2 = helper.getNode('n2');

      n2.should.have.property('name', 'Device 123');
      
      done();
    });
  });

  it('should open a websocket connection', done => {
    const connection = { openWebSocket() { } };
    
    const openWebSocketStub = sinon.stub(connection, 'openWebSocket')
      .callsFake((callback) => callback({ someData: 'new event' }));

    const loginStub = sinon.stub(eWeLinkConnect, 'login')
      .callsFake(() => Promise.resolve(connection));

    const flow = [
      { id: 'n1', type: 'ewelink-credentials' },
      { id: 'n2', type: 'ewelink-event-listener', auth: 'n1', deviceId: '' }
    ];
    helper.load([credentialsNode, eventListenerNode], flow, credentials, () => {
      setTimeout(() => {
        sinon.assert.calledOnce(openWebSocketStub);
        sinon.assert.calledOnce(loginStub);

        openWebSocketStub.restore();
        loginStub.restore();

        done();
      });
    });
  });

  it('should return any events if device id is not set', done => {
    const connection = { openWebSocket() { } };
    
    const openWebSocketStub = sinon.stub(connection, 'openWebSocket')
      .callsFake((callback) => callback({ deviceid: '1234' }));

    const loginStub = sinon.stub(eWeLinkConnect, 'login')
      .callsFake(() => Promise.resolve(connection));

    const flow = [
      { id: 'n1', type: 'ewelink-credentials' },
      { id: 'n2', type: 'ewelink-event-listener', auth: 'n1', deviceId: '', wires: [['n3']] },
      { id: 'n3', type: 'helper' }
    ];
    helper.load([credentialsNode, eventListenerNode], flow, credentials, () => {
      const n3 = helper.getNode('n3');

      n3.on('input', msg => {
        expect(msg).to.deep.include({ payload: { deviceid: '1234' } });
        
        done();
      });

      setTimeout(() => {
        sinon.assert.calledOnce(openWebSocketStub);
        sinon.assert.calledOnce(loginStub);

        openWebSocketStub.restore();
        loginStub.restore();
      });
    });
  });

  it('should not return event if device id does not match', done => {
    const connection = { openWebSocket() { } };
    
    const openWebSocketStub = sinon.stub(connection, 'openWebSocket')
      .callsFake((callback) => callback({ deviceid: '1234' }));

    const loginStub = sinon.stub(eWeLinkConnect, 'login')
      .callsFake(() => Promise.resolve(connection));

    const flow = [
      { id: 'n1', type: 'ewelink-credentials' },
      { id: 'n2', type: 'ewelink-event-listener', auth: 'n1', deviceId: '1234abc', wires: [['n3']] },
      { id: 'n3', type: 'helper' }
    ];
    helper.load([credentialsNode, eventListenerNode], flow, credentials, () => {
      const n3 = helper.getNode('n3');

      let handled = false;
      n3.on('input', () => {
        handled = true;
      });

      setTimeout(() => {
        sinon.assert.calledOnce(openWebSocketStub);
        sinon.assert.calledOnce(loginStub);

        openWebSocketStub.restore();
        loginStub.restore();

        setTimeout(() => {
          if (! handled) {
            done();
          }
        });
      });
    });
  });

  it('should not return control messages like "pong"', done => {
    const connection = { openWebSocket() { } };
    
    const openWebSocketStub = sinon.stub(connection, 'openWebSocket')
      .callsFake((callback) => callback('pong'));

    const loginStub = sinon.stub(eWeLinkConnect, 'login')
      .callsFake(() => Promise.resolve(connection));

    const flow = [
      { id: 'n1', type: 'ewelink-credentials' },
      { id: 'n2', type: 'ewelink-event-listener', auth: 'n1', deviceId: '', wires: [['n3']] },
      { id: 'n3', type: 'helper' }
    ];
    helper.load([credentialsNode, eventListenerNode], flow, credentials, () => {
      const n3 = helper.getNode('n3');

      let handled = false;
      n3.on('input', () => {
        handled = true;
      });

      setTimeout(() => {
        sinon.assert.calledOnce(openWebSocketStub);
        sinon.assert.calledOnce(loginStub);

        openWebSocketStub.restore();
        loginStub.restore();

        setTimeout(() => {
          if (! handled) {
            done();
          }
        });
      });
    });
  });

  it('should return event if device id matches', done => {
    const connection = { openWebSocket() { } };
    
    const openWebSocketStub = sinon.stub(connection, 'openWebSocket')
      .callsFake((callback) => callback({ deviceid: '1234' }));

    const loginStub = sinon.stub(eWeLinkConnect, 'login')
      .callsFake(() => Promise.resolve(connection));

    const flow = [
      { id: 'n1', type: 'ewelink-credentials' },
      { id: 'n2', type: 'ewelink-event-listener', auth: 'n1', deviceId: '1234', wires: [['n3']] },
      { id: 'n3', type: 'helper' }
    ];
    helper.load([credentialsNode, eventListenerNode], flow, credentials, () => {
      const n3 = helper.getNode('n3');

      n3.on('input', msg => {
        expect(msg).to.deep.include({ payload: { deviceid: '1234' } });
        
        done();
      });

      setTimeout(() => {
        sinon.assert.calledOnce(openWebSocketStub);
        sinon.assert.calledOnce(loginStub);

        openWebSocketStub.restore();
        loginStub.restore();
      });
    });
  });
});
