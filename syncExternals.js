const cp = require('child_process');
const chokidar = require('chokidar');
const syncExternalsList = require('./syncExternalsList.js').syncExternalsList;

let bounceTimer = null;

chokidar.watch('.', {ignored: /node_modules|(^|[\/\\])\../}).on('all', (event, path) => {
  console.log('change', event, path);
  if (bounceTimer) clearTimeout(bounceTimer);
  bounceTimer = setTimeout(() => {
    bounceTimer = null;
    syncFolders();
  }, 100);
});

const createSyncScript = folder => `rsync -av --progress ./* ${folder} --exclude node_modules`;

function syncFolders() {
  syncExternalsList
    .map(path => {
      if (path.indexOf('*tus*') === 0) {
        path = '/mnt/' + path[5].toLowerCase() + path.substr(7).replace(/\\/g, '/')
      }
      return path;
    })
    .forEach(syncFolder);
}

function syncFolder(folder) {
  // help: https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
  cp.exec(createSyncScript(folder), {}, (error, stdout, stderr) => {
    if (stdout.toString()) console.log('info', stdout.toString());
    if (stderr.toString()) console.log('errors', stderr.toString());

    if (error)
      console.log('Sync error', error);
    else
      console.log('success');
  });
}
