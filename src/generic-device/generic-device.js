const eWeLinkConnect = require('../utils/ewelink-connect');

/**
 * Generic device node.
 */
module.exports = (RED) => {
  /**
   * Generic device node constructor.
   * 
   * @param {object} config The node configuration.
   */
  function GenericDeviceNode(config) {
    // Create the node
    RED.nodes.createNode(this, config);

    // Initialize device node
    eWeLinkConnect.initializeDeviceNode(RED, this, config);
  }

  // Register node
  RED.nodes.registerType('ewelink-generic-device', GenericDeviceNode);
}
