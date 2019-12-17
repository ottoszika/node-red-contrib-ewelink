const eWeLinkConnect = require('../utils/ewelink-connect');

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
    
    // Wait until eWeLink connection is ready
    eWeLinkConnect.ready(RED, this, config).then(connection => {
      this.on('input', () => {
        connection.getDevices().then(devices => {
          this.send({ payload: devices });
        }).catch(error => this.error(error));
      })
    }).catch(error => this.error(error));
  }

  // Register node
  RED.nodes.registerType('ewelink-devices', DevicesNode);
}
