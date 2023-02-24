
import { test } from '@playwright/test';
import { owner, repo, branch, apiKey, authorName, commitDate, timeOut, noApiKeyExpStatusCode } from "./env.js";
import assert from "assert";

let githubUrl: any;
let testTimeOut: any;

function getProvideStr(key) {
    return `'${key}' is null or empty - Please provide as an environment variable (or as the default in env.js).`
}

test.beforeAll(async () => {

    // Check that all Required Params are not Null and not Empty.
    const mandatoryParams = {
        'owner':owner,
        'repo':repo,
        'apiKey':apiKey,
        'authorName':authorName,
        'commitDate':commitDate,
        'timeOut':timeOut,
        'noApiKeyExpStatusCode':noApiKeyExpStatusCode
    };
    for (const param in mandatoryParams) { 
        const value = mandatoryParams[param];
        assert.ok(value,getProvideStr(param));
    };

    // Check that the provided value for timeOut is an appropriate Integer.
    // Set the default timeOut for tests according to what was provided.
    try {
        testTimeOut = parseInt(timeOut);
        test.setTimeout(parseInt(testTimeOut));
    } catch (e) {
        throw new Error(`Unable to convert 'timeOut': ${timeOut} to an Integer - Please provide an appropriate value.`);
    }

    // Determine the GitHub API URL based on the provided variables
    // If a branch is specified then the URL will point at that branch.
    githubUrl = `https://api.github.com/repos/${owner}/${repo}/commits`;
    if (branch) {
        githubUrl += `?sha=${branch}`
        console.log(`Owner: <${owner}> | Repo: <${repo}> | Branch: <${branch}>`);
    } else {
        console.log(`Owner: <${owner}> | Repo: <${repo}> (No specific branch specified.)`);
    }
});

test('Verify appropriate rejection to non-present apiKey', async () => {

    // Attempt GET request to GitHub API with no headers (and thus API Key) provided.
    const response = await fetch(githubUrl);

    // Assert that the StatusCode matches that expected. (Fail).
    assert.strictEqual(response.status, noApiKeyExpStatusCode, 
        `Response for API GET request to: ${githubUrl} (without headers) returned StatusCode: ${response.status} - ${noApiKeyExpStatusCode} was expected`);

});

test('Verify most recent commit with valid apiKey', async () => {
    // Attempt GET request to GitHub API with Headers (, API Key) provided.
    const response = await fetch(githubUrl, {
        headers: {
            Authorization: `Bearer ${apiKey}`
        },
    });

    // Assert that the Status Code is OK (2**)
    assert.ok(response.ok, 
        `Response for API GET request to <${githubUrl}> with apiKey: <${apiKey}> returned a NOK StatusCode: <${response.status}>`);

    // Convert the Response to JSON
    const commits = await response.json();

    // Throw Error if there are no Commits available.
    if (commits.length === 0) {
        throw new Error('There are no commits available.');
    }

    // Set LatestCommit as the first index (most recent) if available.
    const latestCommit = commits[0];

    // console.log("Latest commit:");
    // console.log(latestCommit);

    const responseAuthorName = latestCommit.commit.author.name;
    const responseCommitDate = latestCommit.commit.committer.date.split("T")[0];

    // Assert that the LatestCommit has an Author and CommitDate matching those provided as variables.
    assert.strictEqual(responseAuthorName, authorName, `Latest Commit Author - Expected: <${authorName}> - Actual: <${responseAuthorName}>`);
    assert.strictEqual(responseCommitDate, commitDate, `Latest Commit Date - Expected: <${commitDate}> - Actual: <${responseCommitDate}>`);
});