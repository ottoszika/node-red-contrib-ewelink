const eWeLinkConnect = require('../utils/ewelink-connect');

/**
 * Power state read node.
 */
module.exports = (RED) => {
  /**
   * Power state read node constructor.
   * 
   * @param {object} config The node configuration.
   */
  function PowerStateReadNode(config) {
    // Create the node
    RED.nodes.createNode(this, config);

    // Initialize device node
    eWeLinkConnect.initializeDeviceNode(RED, this, config, 'getDevicePowerState', msg => [config.channel]);
  }

  // Register node
  RED.nodes.registerType('ewelink-power-state-read', PowerStateReadNode);
}
