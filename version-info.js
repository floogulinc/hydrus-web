const { gitDescribeSync } = require('git-describe');
const { version } = require('./package.json');
const { resolve, relative } = require('path');
const { writeFileSync } = require('fs-extra');
const branch = require('git-branch');

// // Mostly from this article: https://medium.com/@amcdnl/version-stamping-your-app-with-the-angular-cli-d563284bb94d

// var info;
// if(process.env.VERCEL_GITHUB_DEPLOYMENT) {
//   console.log(`Detected GitHub deployment on Vercel. URL: ${process.env.VERCEL_URL}`);
//   gitInfo = {
//       infotype: "vercel-github",
//       gitinfo: {
//           VERCEL_URL: process.env.VERCEL_URL,
//           VERCEL_GITHUB_DEPLOYMENT: process.env.VERCEL_GITHUB_DEPLOYMENT,
//           VERCEL_GITHUB_COMMIT_REF: process.env.VERCEL_GITHUB_COMMIT_REF,
//           VERCEL_GITHUB_COMMIT_SHA: process.env.VERCEL_GITHUB_COMMIT_SHA,
//       },
//       hash: process.env.VERCEL_GITHUB_COMMIT_SHA,
//       branch: process.env.VERCEL_GITHUB_COMMIT_REF
//   }
// } else {
//   gitInfo = {
//       infotype: "git-describe",
//       gitinfo: gitDescribeSync({
//           customArguments: ['--abbrev=40'],
//           dirtyMark: false,
//           dirtySemver: false
//       }),
//       branch: branch.sync()
//   };
//   gitInfo.hash = gitInfo.gitinfo.hash.substring(1);
// }

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
