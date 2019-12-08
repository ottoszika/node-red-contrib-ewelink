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
