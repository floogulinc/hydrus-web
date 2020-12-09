const { version } = require('./package.json');
const { resolve, relative } = require('path');
const { writeFileSync } = require('fs-extra');
const git = require('git-rev-sync');

var info;

if(process.env.VERCEL_GITHUB_DEPLOYMENT) {
  console.log(`Detected GitHub deployment on Vercel. URL: ${process.env.VERCEL_URL}`);
  var info = {
    branch: process.env.VERCEL_GITHUB_COMMIT_REF,
    hash: process.env.VERCEL_GITHUB_COMMIT_SHA,
    version,
    vercel: {
      VERCEL_URL: process.env.VERCEL_URL
    }
  };
} else {
  info = {
    branch: git.branch(),
    hash: git.long(),
    version,
    vercel: null
  };
}

const file = resolve(__dirname, '.', 'src', 'environments', 'version.json');
writeFileSync(file, JSON.stringify(info, null, 2));

console.log(`Wrote version info ${info.hash} (branch: ${info.branch}) to ${relative(resolve(__dirname, '..'), file)}`);
