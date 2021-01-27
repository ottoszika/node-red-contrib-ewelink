module.exports = {
  /**
   * Ready promise.
   * 
   * @param {object} RED The NodeRED instance.
   * @param {object} node The current node.
   * @param {object} config The node configuration.
   */
  ready(RED, node, config) {
    // Get credentials node
    const credentialsNode = RED.nodes.getNode(config.auth);

    // Check for valid credential node
    if (!credentialsNode) {
      throw new Error('No credentials provided!');
    }

    // Set the node status to 'connecting'
    this.setNodeStatusToConnecting(node);

    return new Promise((resolve, reject) => {
      credentialsNode.getCredentials().then(response => {
        if (response.error) {
          this.setNodeStatusToDisconnected(node);
          return reject(response);
        }
        this.setNodeStatusToConnected(node);
        return resolve(credentialsNode.connection);
      })
      .catch(error => {
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
    this.ready(RED, node, config).then(connection => {
      // Once logged in we can listen to inputs
      node.on('input', (msg) => {
        // Get method name and build params
        const evaluatedMethod = method || msg.payload.method;
        const evaluatedParams = (typeof params === 'function' ? params(msg) : params) || msg.payload.params || [];
        
        let device_id = '';
        if (deviceId) {
          device_id = deviceId;
        } else if (typeof msg.deviceId !== "undefined") {
          device_id = msg.deviceId || '';
        }
        // First parameter should be always the device ID
        evaluatedParams.unshift(device_id);

        // Call dynamically the method
        connection[evaluatedMethod].apply(connection, evaluatedParams).then(result => {
          node.send({ deviceId: device_id, payload: result });
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