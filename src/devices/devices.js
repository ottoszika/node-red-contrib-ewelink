var eWeLinkConnect = require('../utils/ewelink-connect');

/**
 * Devices node.
 * Lists all the available devices.
 */
module.exports = (RED) => {
  /**
   * Devices node constructor.
   * 
   * @param {object} config The node configuration.
   */
  function DevicesNode(config) {
    // Create the node
    RED.nodes.createNode(this, config);
    
    // Log in to eWeLink
    eWeLinkConnect.login(RED, this, config).then(connection => {
      // Once logged in we can listen to inputs
      this.on('input', () => {
        connection.getDevices().then(devices => {
          this.send({ payload: devices });
        }).catch(err => this.error(err));
      })
    }).catch(error => this.error(error));
  }

  // Register node
  RED.nodes.registerType('ewelink-devices', DevicesNode);
}
