const { version } = require('./package.json');
const { resolve, relative } = require('path');
const { writeFileSync } = require('fs-extra');

var info;

if(process.env.VERCEL_GITHUB_DEPLOYMENT) {
  console.log(`Detected GitHub deployment on Vercel. URL: ${process.env.VERCEL_URL}`);
  info = {
    branch: process.env.VERCEL_GITHUB_COMMIT_REF,
    hash: process.env.VERCEL_GITHUB_COMMIT_SHA,
    version,
    vercel: {
      VERCEL_URL: process.env.VERCEL_URL
    }
  };
} else if (process.env.GITHUB_ACTIONS) {
  console.log(`Detected GitHub Actions build`);
  info = {
    branch: process.env.GITHUB_REF_NAME,
    hash: process.env.GITHUB_SHA,
    version,
    vercel: null
  }
} else {
  const git = require('git-rev-sync');

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
