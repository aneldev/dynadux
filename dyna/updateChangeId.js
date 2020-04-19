const dynaNodeFs = require('dyna-node-fs');
const guid = require('dyna-guid').guid;

(async () => {
  const package_ = await dynaNodeFs.loadJSON('./package.json');
  package_.dyna = { changeId: guid() };
  await dynaNodeFs.saveJSON('./package.json', package_, true);
  console.log('changeId', package_.dyna.changeId);
})()
