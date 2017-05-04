const fs = require('fs');

const loadRpc = (context) => {
  let file = context.props.args.rpcfile || 'rpc.json';
  return { rpcList: JSON.parse(fs.readFileSync(file, 'utf8')) };
};

loadRpc.config = { name: 'load-rpc-file' };

module.exports = {
  loadRpc
};