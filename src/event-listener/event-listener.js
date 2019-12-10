const eWeLinkConnect = require('../utils/ewelink-connect');

/**
 * Event listener node.
 */
module.exports = (RED) => {
  /**
   * Event listener node constructor.
   * 
   * @param {object} config The node configuration.
   */
  function EventListenerNode(config) {
    // Create the node
    RED.nodes.createNode(this, config);

    // Login
    eWeLinkConnect.login(RED, this, config).then(connection => {
      // Open websocket for real-time events
      connection.openWebSocket(data => {
        // Return the payload if the device ID was not set or the event
        // is related to the selected one. Also handle only objects
        // to ignore control packages such as "pong".
        if (typeof data === 'object' && (!config.deviceId || data['deviceid'] === config.deviceId)) {
          this.send({ payload: data });
        }
      });
    });
  }

  // Register node
  RED.nodes.registerType('ewelink-event-listener', EventListenerNode);
}
