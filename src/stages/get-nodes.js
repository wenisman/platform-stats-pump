const EC2 = require('aws-sdk').EC2;
const taskify = require('../shared/taskify');
const Task = require('data.task');

const ec2 = new EC2();
const describeInstances = taskify(ec2.describeInstances, ec2);


const list = context => {
  console.log(context);
  return describeInstances({
    Filters: [
      { Name: 'tag', Values: [`Environment=${context.props.args.environment}`, 'Role=Solace'] }
    ]
  }).chain(result => {
    console.log(result);
    return Task.of(result);
  });
};


module.exports = {
  list
};
