const request = require('request');
const taskify = require('../shared/taskify');
const Task = require('data.task');
const R = require('ramda');

const createPipeline = require('easy-pipeline');

const post = taskify(request.post, request);
let _context = null;

const rpcs = {
  active_topics: '<rpc semp-version="soltr/7_2"><show><message-vpn><vpn-name>default</vpn-name><subscriptions></subscriptions></message-vpn></show></rpc>',
  active_subscribers: '<rpc semp-version="soltr/7_2"><show><client><name>*</name><subscriptions></subscriptions></client></show></rpc>',
  message_latency: '<rpc semp-version="soltr/7_2"><show><stats><client><detail></detail></client></stats></show></rpc>',
  message_throughput: '<rpc semp-version="soltr/7_2"><show><stats><client><detail></detail></client></stats></show></rpc>'
}

const postPipeline = () => {
  return createPipeline(R.unnest(R.map(R.curry(callRpc)(`http://${addr}:8080/SEMP`), Object.getOwnPropertyNames(_context.props.rpcList))));
};


const callRpc = (addr, name) => {
  _context.log.debug({ addr, name });
  return post({ url: addr, body: rpcs[name], headers: { Authorization: `Basic ${_context.props.args.authkey}` } })
    .chain(result => {
      let output = {};
      output[name] = result;
      return Task.of(output);
    });
}

const loadData = addr => {
  return R.traverse(Task.of, R.curry(callRpc)(`http://${addr}:8080/SEMP`), Object.getOwnPropertyNames(_context.props.rpcList))
    .chain(result => {
      _context.log.debug(result);
      let output = {};
      output[addr] = result;
      return Task.of(output);
    });
}

const loadNodes = context => {
  _context = context;
  return R.traverse(Task.of, loadData, context.props.solace.nodeAddrs)
    .chain(result => {
      // chuck this in a cache/log it
      return Task.of({ stats: result });
    });
}

loadNodes.config = { name: 'load-nodes' };

module.exports = {
  loadNodes
};