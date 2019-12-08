var helper = require('node-red-node-test-helper');
var basicNode = require('../src/basic/basic');

describe('basic Node', function () {

  afterEach(function () {
    helper.unload();
  });

  it('should be loaded', function (done) {
    var flow = [{ id: 'n1', type: 'basic', name: "test name" }];
    helper.load(basicNode, flow, function () {
      var n1 = helper.getNode('n1');

      n1.should.have.property('name', 'test name');
      
      done();
    });
  });

  it('should reverse payload', function (done) {
    var flow = [{ id: 'n1', type: 'basic', name: 'test name', wires:[['n2']] },
    { id: 'n2', type: 'helper' }];
    helper.load(basicNode, flow, function () {
      var n2 = helper.getNode('n2');
      var n1 = helper.getNode('n1');

      n2.on('input', function (msg) {
        msg.should.have.property('payload', 'Hello World!');
        done();
      });

      n1.receive({ payload: '!dlroW olleH' });
    });
  });
});