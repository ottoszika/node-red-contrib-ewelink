module.exports = function (RED) {
    function BasicNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.on('input', function (msg) {
            msg.payload = msg.payload.split('').reverse().join('');
            node.send(msg);
        });
    }

    RED.nodes.registerType('basic', BasicNode);
}
