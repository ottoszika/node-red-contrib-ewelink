const eWeLinkConnect = require('../utils/ewelink-connect');

/**
 * Channel count node.
 */
module.exports = (RED) => {
  /**
   * Channel count node constructor.
   * 
   * @param {object} config The node configuration.
   */
  function ChannelCountNode(config) {
    // Create the node
    RED.nodes.createNode(this, config);

    // Initialize device node
    eWeLinkConnect.initializeDeviceNode(RED, this, config, 'getDeviceChannelCount');
  }

  // Register node
  RED.nodes.registerType('ewelink-channel-count', ChannelCountNode);
}
