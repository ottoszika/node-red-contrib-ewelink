const eWeLinkConnect = require('../utils/ewelink-connect');

/**
 * Power usage node.
 */
module.exports = (RED) => {
  /**
   * Power usage node constructor.
   * 
   * @param {object} config The node configuration.
   */
  function PowerUsageNode(config) {
    // Create the node
    RED.nodes.createNode(this, config);

    // Initialize device node
    eWeLinkConnect.initializeDeviceNode(RED, this, config, 'getDevicePowerUsage');
  }

  // Register node
  RED.nodes.registerType('ewelink-power-usage', PowerUsageNode);
}
