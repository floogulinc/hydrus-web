const { gitDescribeSync } = require('git-describe');
const { version } = require('./package.json');
const { resolve, relative } = require('path');
const { writeFileSync } = require('fs-extra');
const branch = require('git-branch');

// Mostly from this article: https://medium.com/@amcdnl/version-stamping-your-app-with-the-angular-cli-d563284bb94d

var gitInfo;
if(process.env.VERCEL_GITHUB_DEPLOYMENT) {
    gitInfo = {
        infotype: "vercel-github",
        gitinfo: {
            VERCEL_URL: process.env.VERCEL_URL,
            VERCEL_GITHUB_DEPLOYMENT: process.env.VERCEL_GITHUB_DEPLOYMENT,
            VERCEL_GITHUB_ORG: process.env.VERCEL_GITHUB_ORG,
            VERCEL_GITHUB_REPO: process.env.VERCEL_GITHUB_REPO,
            VERCEL_GITHUB_COMMIT_ORG: process.env.VERCEL_GITHUB_COMMIT_ORG,
            VERCEL_GITHUB_COMMIT_REPO: process.env.VERCEL_GITHUB_COMMIT_REPO,
            VERCEL_GITHUB_COMMIT_REF: process.env.VERCEL_GITHUB_COMMIT_REF,
            VERCEL_GITHUB_COMMIT_SHA: process.env.VERCEL_GITHUB_COMMIT_SHA,
            VERCEL_GITHUB_COMMIT_AUTHOR_LOGIN: process.env.VERCEL_GITHUB_COMMIT_AUTHOR_LOGIN,
            VERCEL_GITHUB_COMMIT_AUTHOR_NAME: process.env.VERCEL_GITHUB_COMMIT_AUTHOR_NAME,
        },
        hash: process.env.VERCEL_GITHUB_COMMIT_SHA,
        branch: process.env.VERCEL_GITHUB_COMMIT_REF
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
    gitInfo.hash = gitInfo.gitinfo.hash.substring(1);
}


gitInfo.version = version;

const file = resolve(__dirname, '.', 'src', 'environments', 'version.ts');
writeFileSync(file,
`// IMPORTANT: THIS FILE IS AUTO GENERATED! DO NOT MANUALLY EDIT OR CHECKIN!
/* tslint:disable */
export const VERSION = ${JSON.stringify(gitInfo, null, 4)};
/* tslint:enable */
`, { encoding: 'utf-8' });

console.log(`Wrote version info ${gitInfo.hash} (branch: ${gitInfo.branch}) to ${relative(resolve(__dirname, '..'), file)}`);
