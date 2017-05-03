#!/usr/bin/env node

const aws = require('aws-sdk');
const getNodes = require('./stages/get-nodes');
const solaceRpc = require('./stages/solace-rpc');
const createPipeline = require('easy-pipeline');
const argv = require('yargs').argv;

aws.config.update({ region: 'ap-southeast-2' });

const pipeline = createPipeline(getNodes.list, solaceRpc.loadNodes);

let context = { args: argv };

let flow = () => {
  setTimeout(
    () => {
      console.log('starting');
      pipeline(context).fork(err => console.error(err), r => { console.log(r); flow()} );
    },
    3 * 1000
  );
};

flow();
