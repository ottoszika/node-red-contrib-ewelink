const eWeLinkConnect = require('../utils/ewelink-connect');

/**
 * Temperature node.
 */
module.exports = (RED) => {
  /**
   * Temperature node constructor.
   * 
   * @param {object} config The node configuration.
   */
  function TemperatureNode(config) {
    // Create the node
    RED.nodes.createNode(this, config);

    // Initialize device node
    eWeLinkConnect.initializeDeviceNode(RED, this, config, 'getDeviceCurrentTemperature');
  }

  // Register node
  RED.nodes.registerType('ewelink-temperature', TemperatureNode);
}
