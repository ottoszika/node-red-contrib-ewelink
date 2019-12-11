const eWeLinkConnect = require('../utils/ewelink-connect');

/**
 * Humidity node.
 */
module.exports = (RED) => {
  /**
   * Humidity node constructor.
   * 
   * @param {object} config The node configuration.
   */
  function HumidityNode(config) {
    // Create the node
    RED.nodes.createNode(this, config);

    // Initialize device node
    eWeLinkConnect.initializeDeviceNode(RED, this, config, 'getDeviceCurrentHumidity');
  }

  // Register node
  RED.nodes.registerType('ewelink-humidity', HumidityNode);
}
