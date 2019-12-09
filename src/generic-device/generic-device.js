var eWeLinkConnect = require('../utils/ewelink-connect');

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

    // Clean up device ID
    const deviceId = config.deviceId ? config.deviceId.trim() : '';
    
    // Log in to eWeLink
    eWeLinkConnect.login(RED, this, config).then(connection => {
      // Once logged in we can listen to inputs
      this.on('input', (msg) => {
        let { method, params } = msg.payload;

        // Set params to empty array if not set
        params = params || [];

        // First parameter should be always the device ID
        params.unshift(deviceId);
        
        // Call dynamically the method
        connection[method].apply(connection, params).then(result => {
          this.send({ payload: result });
        }).catch(error => this.error(error));
      })
    }).catch(error => this.error(error));
  }

  // Register node
  RED.nodes.registerType('ewelink-generic-device', GenericDeviceNode);
}
