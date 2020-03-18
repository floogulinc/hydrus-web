const { gitDescribeSync } = require('git-describe');
const { version } = require('./package.json');
const { resolve, relative } = require('path');
const { writeFileSync } = require('fs-extra');
const branch = require('git-branch');

// Mostly from this article: https://medium.com/@amcdnl/version-stamping-your-app-with-the-angular-cli-d563284bb94d

var gitInfo;
if(process.env.NOW_GITHUB_DEPLOYMENT) {
    gitInfo = {
        infotype: "now-github",
        gitinfo: {
            NOW_GITHUB_DEPLOYMENT: process.env.NOW_GITHUB_DEPLOYMENT,
            NOW_GITHUB_ORG: process.env.NOW_GITHUB_ORG,
            NOW_GITHUB_REPO: process.env.NOW_GITHUB_REPO,
            NOW_GITHUB_COMMIT_ORG: process.env.NOW_GITHUB_COMMIT_ORG,
            NOW_GITHUB_COMMIT_REPO: process.env.NOW_GITHUB_COMMIT_REPO,
            NOW_GITHUB_COMMIT_REF: process.env.NOW_GITHUB_COMMIT_REF,
            NOW_GITHUB_COMMIT_SHA: process.env.NOW_GITHUB_COMMIT_SHA,
            NOW_GITHUB_COMMIT_AUTHOR_LOGIN: process.env.NOW_GITHUB_COMMIT_AUTHOR_LOGIN,
            NOW_GITHUB_COMMIT_AUTHOR_NAME: process.env.NOW_GITHUB_COMMIT_AUTHOR_NAME,
            hash: process.env.NOW_GITHUB_COMMIT_SHA
        },
        branch: process.env.NOW_GITHUB_COMMIT_REF
    }
} else {
    gitInfo = {
        infotype: "git-describe",
        gitinfo: gitDescribeSync({
            customArguments: ['--abbrev=40'],
            dirtyMark: false,
            dirtySemver: false
        }),
        branch: branch.sync()
    };
}


gitInfo.version = version;

const file = resolve(__dirname, '.', 'src', 'environments', 'version.ts');
writeFileSync(file,
`// IMPORTANT: THIS FILE IS AUTO GENERATED! DO NOT MANUALLY EDIT OR CHECKIN!
/* tslint:disable */
export const VERSION = ${JSON.stringify(gitInfo, null, 4)};
/* tslint:enable */
`, { encoding: 'utf-8' });

console.log(`Wrote version info ${gitInfo.gitinfo.hash} to ${relative(resolve(__dirname, '..'), file)}`);
