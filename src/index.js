import getNodes from './stages/get-nodes';
import solaceRpc from './stages/solace-rpc';
import createPipeline from 'easy-pipeline';


const sewage = createPipeline(getNodes, solaceRpc);


let flow = setTimeout(
  () => { sewage().fork(err => console.error(err), r => { console.log(r); flow()} ); },
  30 * 1000
);

