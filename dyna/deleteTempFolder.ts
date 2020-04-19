const execSync = require('child_process').execSync;

export const deleteTempFolder = (): void => {
  console.log('Deleting temp folder...');
  execSync("rm -rf ./temp", function (err: Error, stdout: string) {
    console.log(stdout);
    if (err) console.error('Error, cannot clear the temp folder', err);
  });
  console.log('Deleting temp folder, completed');
};
