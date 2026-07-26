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
| T02 |  |  | Repo-side only — the actual DNS/TLS connection is done manually via the organizer DNS portal (credentials not handled in code). Added: (1) `generate-status.mjs` now reports `domain.publicUrl`/`domain.connected` in `/status`, `connected=true` once the build's `VITE_PUBLIC_URL` is an `https://` URL; (2) new `domain-check.yml` (`workflow_dispatch`) that checks A record, TXT record (compared against `secrets.DNS_TXT_VALUE`, never printed), HTTPS/HTTP domain, raw IP, and a `--resolve` host-header dry run, writing pass/fail evidence to the job summary and an uploaded `domain-check-<sha>-<run>` manifest. Requires the DNS portal steps to be completed and `DNS_PORTAL_USERNAME`/`DNS_PORTAL_PASSWORD`/`DNS_TXT_VALUE` added as GitHub Secrets (manual, not done here) before checks will pass live. |
| T03 |  |  | `deploy.yml` downloads the CI-built `site-dist-<sha>` artifact (via `actions/download-artifact@v4`, resolving the source CI run from the `workflow_run` event or the GitHub API) instead of rebuilding, writes `release-candidate/artifact.json` recording task/artifact/commit/CI-run-id, publishes it as job summary + `release-manifest-<sha>` artifact, and forwards the artifact identity in the organizer dispatch payload. |
| T04 |  |  | New `rollback.yml` (`workflow_dispatch` with required `release_ref` input) resolves a tag/SHA/artifact-id to a commit on `main`, locates its successful CI run, downloads the matching `site-dist-<sha>` artifact, records a rollback manifest (job summary + `rollback-manifest-<sha>-<run>` artifact), and dispatches the same organizer redeploy request used by `deploy.yml`, pointed at the known-good commit. |
| T05 |  |  |  |
| T06 |  |  | `ci.yml` already ran on `pull_request` + push to `main` with Node 20, `npm ci`, `npm run build`, and `upload-artifact` (`site-dist-<sha>`) from prior tasks; added `permissions: contents: read` (least privilege) and a `concurrency` group with `cancel-in-progress` so stale runs on the same ref don't linger. `deploy.yml` already depends on this build via its `workflow_run: ["CI"]` trigger gated on `conclusion == 'success'`, unchanged here. |
| T07 |  |  | New `server/index.js` (Express) exposes `/health`, `/status` (`weather.provider=openweather`, `configured` flag), and `/api/weather`, which calls OpenWeather server-side using `OPENWEATHER_API_KEY` so the key never reaches browser code. CI adds a `server-smoke-test` job that installs and starts the server without a key and checks `/health`, `/status`, and the `503` response from `/api/weather` when unconfigured — no live OpenWeather call or secret needed in CI. Pending: `OPENWEATHER_API_KEY` GitHub Secret setup and live end-to-end verification (local test hit a `401`, likely a new-key activation delay); actual deployment of this server on the VPS depends on containerization work (T14/T18/T22) that isn't done yet. |
| T08 |  |  | Cherry-picked the single commit from organizer branch `task-assets/rebase-feature` (`Add rebase feature asset` — new `LearningVelocity` dashboard section) onto `main`; its history was already based on our current `main`, so it applied with no conflicts and no force-push. `git diff main` on this branch matches the organizer commit's diff exactly (3 files, `App.tsx`/`LearningVelocity.tsx`/`styles.css`). Verified with `tsc --noEmit && vite build` locally — build passes. |
| T09 |  |  | Merged organizer branch `task-assets/conflict-merge` into this task branch via GitHub's compare/merge UI. That branch replaces the `repo-setup-checkpoint` deadline card in `team-site/src/data/deadlines.ts` with a new `merge-conflict-lab` card (id, label, due date, action text all changed). No teammate had touched this specific entry since the branch was cut, so the merge applied cleanly with no conflict markers — nothing to reconcile between competing versions, since only one side had changed this content. Verified `tsc --noEmit && vite build` still passes after the merge. |
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
