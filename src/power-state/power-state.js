const eWeLinkConnect = require('../utils/ewelink-connect');

/**
 * Power state node.
 */
module.exports = (RED) => {
  /**
   * Power state node constructor.
   * 
   * @param {object} config The node configuration.
   */
  function PowerStateNode(config) {
    // Create the node
    RED.nodes.createNode(this, config);

    // Initialize node by mode
    switch (config.mode) {
      case 'read':
        eWeLinkConnect.initializeDeviceNode(RED, this, config, 'getDevicePowerState');
        break;
      case 'write':
        eWeLinkConnect.initializeDeviceNode(RED, this, config, 'setDevicePowerState', msg => [msg.payload.toLowerCase()]);
        break;
    }
  }

  // Register node
  RED.nodes.registerType('ewelink-power-state', PowerStateNode);
}
