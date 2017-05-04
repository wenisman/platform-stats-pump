#!/usr/bin/env node

const { listNodes } = require('./stages/get-nodes');
const { loadNodes } = require('./stages/solace-rpc');
const createPipeline = require('easy-pipeline');
const argv = require('yargs').argv;


let flow = () => {
  setTimeout(
    () => {
      let context = { args: argv };
      const pipeline = createPipeline(listNodes, loadNodes);
      pipeline(context).fork(err => console.error(err), r => { console.log(r.stats); flow()} );
    },
    3 * 1000
  );
};

flow();
