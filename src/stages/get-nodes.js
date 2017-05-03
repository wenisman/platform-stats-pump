import { EC2 } from aws;
import taskify from '../shared/taskify';

const ec2 = new EC2();
const describeInstances = taskify(ec2.describeInstances, ec2);


const list = context => {
  return describeInstances({
    filters: [
      { Name: 'tag', Values: `name=${context.props.args.environment}-solace` }
    ]
  });
};


export default list;
