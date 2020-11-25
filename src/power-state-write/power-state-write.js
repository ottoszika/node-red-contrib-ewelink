const eWeLinkConnect = require('../utils/ewelink-connect');

/**
 * Power state write node.
 */
module.exports = (RED) => {
  /**
   * Power state write node constructor.
   * 
   * @param {object} config The node configuration.
   */
  function PowerStateWriteNode(config) {
    // Create the node
    RED.nodes.createNode(this, config);

    // Initialize device node
    eWeLinkConnect.initializeDeviceNode(RED, this, config, 'setWSDevicePowerState', msg => [msg.payload.toLowerCase()]);
  }

  // Register node
  RED.nodes.registerType('ewelink-power-state-write', PowerStateWriteNode);
}
