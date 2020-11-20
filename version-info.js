const { gitDescribeSync } = require('git-describe');
const { version } = require('./package.json');
const { resolve, relative } = require('path');
const { writeFileSync } = require('fs-extra');
const branch = require('git-branch');

var gitInfo = gitDescribeSync({
  customArguments: ['--abbrev=40'],
  dirtyMark: false,
  dirtySemver: false
});

info = {
  gitInfo,
  branch: branch.sync(),
  hash: gitInfo.hash.substring(1),
  version
};

if(process.env.VERCEL_GITHUB_DEPLOYMENT) {
  console.log(`Detected GitHub deployment on Vercel. URL: ${process.env.VERCEL_URL}`);
  info.vercel = {
    VERCEL_URL: process.env.VERCEL_URL
  }
}

const file = resolve(__dirname, '.', 'src', 'environments', 'version.json');
writeFileSync(file, JSON.stringify(info, null, 2));

console.log(`Wrote version info ${gitInfo.hash} (branch: ${info.branch}) to ${relative(resolve(__dirname, '..'), file)}`);
