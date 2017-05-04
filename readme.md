# Solace Stats Pump
this is a very light weight implementation of the stats pump for Solace.

## Overview
This is based on the assumption that your system is running the virtual appliance in AWS, as it will automatically look for the EC2 tags

| Tag         | Value       |
| ----------- | ---------   |
| Role        | Solace      |
| Environment | dev/sit/prd |

Currently the Role is defaulted to 'Solace' however you can pass in the role from the commandline. the same goes for the Environment, this is defaulted to 'dev' however you can override this from the command line.

### Authorization 
You will need to provide a basic authorization header key to be able to call Solace, which you can get from Postman or something like.
```
window.btoa(unescape(encodeURIComponent(YOUR_USERNAME + ':' + YOUR_PASSWORD)))
```

## Remote Procedure Calls
currently we only use 4 remote procedure calls
* active_topics
* active_subscribers
* message_latency
* message_throughput

the calls are defined in the solace-rpc file, you can add extra rpcs by adding to this object. Any rpc added to this object will automatically be run and be part of the output. 

## Running Stats Pump
As most config is done from the command line you just start this service by 
```
node src --environment dev --role Solace --authkey basicAuthKey
```

## Output
The output for the stat pump is an array of the Solace nodes that have been hit. The within each object in the array is the IP address, then each property will be the name of the rpc with its xml output. 

The format of the output will look like:
```
[ { ip_address : [ { rpc_name: rpc_output }, { rpc_name: rpc_output } ] ]
```
