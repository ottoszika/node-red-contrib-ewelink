const ewelink = require('ewelink-api');

module.exports = {
  /**
   * Perform a log in.
   * 
   * @param {object} RED The NodeRED instance.
   * @param {object} node The current node.
   * @param {object} config The node configuration.
   */
  login(RED, node, config) {
    // Get credentials node
    const credentialsNode = RED.nodes.getNode(config.auth);

    // Check for valid credential node
    if (!credentialsNode) {
      throw new Error('No credentials provided!');
    }

    // Set the node status to 'connecting'
    this.setNodeStatusToConnecting(node);

    // Get global connection
    let connection = node.context().global.eWeLinkConnection;
    
    // If there is no global connection we create a new one and make it singleton
    if (!connection) {
      connection = new ewelink(credentialsNode.credentials);
      node.context().global.eWeLinkConnection = connection;
    }

    return new Promise((resolve, reject) => { 
      // Logging in
      connection.login().then(response => {
        // Check for errors in the response
        if (response.error) {
          this.setNodeStatusToDisconnected(node);
          return reject(response);
        }

        // If we are here everything is great
        this.setNodeStatusToConnected(node);
        resolve(connection);

        }).catch(error => {
          this.setNodeStatusToDisconnected(node);
          reject(error);
        });
    });
  },

  /**
   * Initialize device node.
   * 
   * @param {object} RED The NodeRED instance.
   * @param {object} node The current node.
   * @param {object} config The node configuration.
   * @param {string} method The method to call on the device.
   * @param {array} params The parameters of the method.
   */
  initializeDeviceNode(RED, node, config, method, params) {
    // Clean up device ID
    const deviceId = config.deviceId ? config.deviceId.trim() : '';

    // Log in to eWeLink
    this.login(RED, node, config).then(connection => {
      // Once logged in we can listen to inputs
      node.on('input', (msg) => {
        method = method || msg.payload.method;
        params = (typeof params === 'function' ? params(msg) : params) || msg.payload.params || [];
        
        // First parameter should be always the device ID
        params.unshift(deviceId);
        
        // Call dynamically the method
        connection[method].apply(connection, params).then(result => {
          node.send({ payload: result });
        }).catch(error => node.error(error));
      })
    }).catch(error => node.error(error));
  },

  /**
   * Set node status to 'connecting'.
   * 
   * @param {object} node The node which status will be changed.
   */
  setNodeStatusToConnecting(node) {
    node.status({
      fill: 'yellow',
      shape: 'dot',
      text: 'connecting'
    });
  },

  /**
   * Set node status to 'connected'.
   * 
   * @param {object} node The node which status will be changed.
   */
  setNodeStatusToConnected(node) {
    node.status({
      fill: 'green',
      shape: 'dot',
      text: 'connected'
    });
  },

  /**
   * Set node status to 'disconnected'.
   * 
   * @param {object} node The node which status will be changed.
   */
  setNodeStatusToDisconnected(node) {
    node.status({
      fill: 'red',
      shape: 'dot',
      text: 'disconnected'
    });
  }
}
