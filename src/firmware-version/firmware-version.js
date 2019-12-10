const eWeLinkConnect = require('../utils/ewelink-connect');

/**
 * Firmware version node.
 */
module.exports = (RED) => {
  /**
   * Firmware version node constructor.
   * 
   * @param {object} config The node configuration.
   */
  function FirmwareVersionNode(config) {
    // Create the node
    RED.nodes.createNode(this, config);

    // Initialize device node
    eWeLinkConnect.initializeDeviceNode(RED, this, config, 'getFirmwareVersion');
  }

  // Register node
  RED.nodes.registerType('ewelink-firmware-version', FirmwareVersionNode);
}
