const request = require('request');
const taskify = require('../shared/taskify');
const Task = require('data.task');
const R = require('ramda');

// context.props.solace => { nodeid: '10.134.48.163:8080', rpc: '<some><long><xml>' }
// semp endpoint : 10.134.48.163:8080/SEMP
const post = taskify(request.post, request);

const rpcs = {
  active_topics: '<rpc semp-version="soltr/7_2_2"><show><message-vpn><vpn-name>default</vpn-name><subscriptions></subscriptions></message-vpn></show></rpc>',
  active_subscribers: '<rpc semp-version="soltr/7_2_2"><show><client><name>*</name><subscriptions></subscriptions></client></show></rpc>',
  message_latency: '<rpc semp-version="soltr/7_2_2"><show><stats><client><detail></detail></client></stats></show></rpc>',
  message_throughput: '<rpc semp-version="soltr/7_2_2"><show><stats><client><detail></detail></client></stats></show></rpc>'
}

const callRpc = (addr, name) => {
  return post(addr, rpcs[name]).chain(result => {
    return { name: result };
  });
}

const loadData = addr => {
  return R.map(callRpc(addr), Object.getOwnPropertyNames(rpcs));
}

const loadNodes = context => {
  return R.map(loadData, context.solace.nodeAddrs).chain(result => {
    // chuck this in a cache/log it
    return Task.of(result);
  });
}

module.exports = {
  loadNodes
};
