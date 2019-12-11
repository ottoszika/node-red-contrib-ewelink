const eWeLinkConnect = require('../utils/ewelink-connect');

/**
 * Temperature and humidity node.
 */
module.exports = (RED) => {
  /**
   * Temperature and humidity node constructor.
   * 
   * @param {object} config The node configuration.
   */
  function TemperatureHumidityNode(config) {
    // Create the node
    RED.nodes.createNode(this, config);

    // Initialize device node
    eWeLinkConnect.initializeDeviceNode(RED, this, config, 'getDeviceCurrentTH');
  }

  // Register node
  RED.nodes.registerType('ewelink-temperature-humidity', TemperatureHumidityNode);
}
