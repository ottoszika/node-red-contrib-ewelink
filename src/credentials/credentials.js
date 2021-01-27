const ewelink = require('ewelink-api');

/**
 * Credentials node.
 * This is a configuration node that holds the credentials for eWeLink.
 */
module.exports = function (RED) {
  /**
   * Credentials node constructor.
   * 
   * @param {object} config The configuration for the node.
   */
  function CredentialsNode(config) {
    // Create the node
    RED.nodes.createNode(this, config);
    
    // Unpack credentials
    this.email = this.credentials.email;
    this.password = this.credentials.password;
    this.region = this.credentials.region;
    
    // Initialize eWeLink
    try {
      this.connection = new ewelink(this.credentials);
      this.getCredentials = function() {
        return this.connection.getCredentials();
      }
    } catch (e) {
      this.connection = { };
      this.getCredentials = function() {
        return Promise.reject(new Error(e));
      }
    }
  }

  // Register node
  RED.nodes.registerType('ewelink-credentials', CredentialsNode, {
    credentials: {
      email: { type: 'email' },
      password: { type: 'password' },
      region: { type: 'text' }
    }
  });
}
