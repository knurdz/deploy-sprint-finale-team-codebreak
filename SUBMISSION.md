# Deploy Sprint Finale Submission

Complete this file on `main` as tasks are completed. Do not paste secrets, private keys, token values, or screenshots that reveal credentials.

## Team

- Team name: CodeBreak
- Team members:
- Live IP URL:
- Assigned domain URL:
- Repository URL:

## Release Evidence

- Current production commit:
- Current artifact/image identifier:
- Current deployment workflow run:
- Current release manifest path or URL:
- Notes on live evidence or fallback evidence:

## Score Summary

- Automated points out of 800:
- Judge points out of 200:
- Final total points out of 1000:

## Completed Tasks

Use this section for short public notes and links. Full task instructions and checks are in the finalist dashboard.

| Task | PR | Evidence | Notes |
| --- | --- | --- | --- |
| T01 | #1 |  | `npm run build` runs `team-site/scripts/generate-status.mjs`, writing `dist/health/index.html` (`ok`) and `dist/status/index.html` (JSON: team, commit SHA, release ID, deploy time, `T01` marker) using `GITHUB_SHA`/`GITHUB_RUN_ID`. CI uploads the artifact; `deploy.yml` dispatches the commit SHA to the organizer's deployer on a successful `main` run. Verify: `IP_PUBLIC_URL/status` commit matches the merged SHA; `IP_PUBLIC_URL/health` returns `ok`. |
| T02 |  |  |  |
| T03 |  |  | `deploy.yml` downloads the CI-built `site-dist-<sha>` artifact (via `actions/download-artifact@v4`, resolving the source CI run from the `workflow_run` event or the GitHub API) instead of rebuilding, writes `release-candidate/artifact.json` recording task/artifact/commit/CI-run-id, publishes it as job summary + `release-manifest-<sha>` artifact, and forwards the artifact identity in the organizer dispatch payload. |
| T04 |  |  | New `rollback.yml` (`workflow_dispatch` with required `release_ref` input) resolves a tag/SHA/artifact-id to a commit on `main`, locates its successful CI run, downloads the matching `site-dist-<sha>` artifact, records a rollback manifest (job summary + `rollback-manifest-<sha>-<run>` artifact), and dispatches the same organizer redeploy request used by `deploy.yml`, pointed at the known-good commit. |
| T05 |  |  |  |
| T06 |  |  |  |
| T07 |  |  |  |
| T08 |  |  |  |
| T09 |  |  |  |
| T10 |  |  |  |
| T11 |  |  |  |
| T12 |  |  |  |
| T13 |  |  |  |
| T14 |  |  |  |
| T15 |  |  |  |
| T16 |  |  |  |
| T17 |  |  |  |
| T18 |  |  |  |
| T19 |  |  |  |
| T20 |  |  |  |
| T21 |  |  |  |
| T22 |  |  |  |
| T23 |  |  |  |
| T24 |  |  |  |
| T25 |  |  |  |
| T26 |  |  |  |
| T27 |  |  |  |
| T28 |  |  |  |
| T29 |  |  |  |
| T30 |  |  |  |

## Public Notes

List anything judges should know without exposing credentials or private infrastructure details.
