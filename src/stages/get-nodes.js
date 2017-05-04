const aws = require('aws-sdk');
const taskify = require('../shared/taskify');
const { compose, prop, map, pluck, unnest } = require('ramda');
const Task = require('data.task');

aws.config.update({
  region: process.env.AWS_REGION || 'ap-southeast-2'
});

const ec2 = new aws.EC2();
const describeInstances = taskify(ec2.describeInstances, ec2);

const getInstances = map(prop('Instances'));
const getPrivateIp = compose(unnest, map(pluck('PrivateIpAddress')));

const getIps = compose(getPrivateIp, getInstances);

const listNodes = context => {
  return describeInstances({
    Filters: [
      { Name: 'tag:Environment', Values: [context.props.args.environment] },
      { Name: 'tag:Role', Values: ['Solace'] }
    ]
  }).chain(result => {
    context.log.debug(result);
    return Task.of({ solace: { nodeAddrs: getIps(result.Reservations) } });
  });
};

listNodes.config = { name: 'list-nodes' };


module.exports = {
  listNodes
};
