import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');

const teamName = process.env.TEAM_NAME || 'codebreak';
const commitSha = process.env.GITHUB_SHA || 'local-dev';
const releaseId = process.env.GITHUB_RUN_ID || `local-${Date.now()}`;
const deployTime = new Date().toISOString();

const statusDir = join(distDir, 'status');
const healthDir = join(distDir, 'health');
mkdirSync(statusDir, { recursive: true });
mkdirSync(healthDir, { recursive: true });

const status = {
  task: 'T01',
  team: teamName,
  commit: commitSha,
  releaseId,
  deployTime,
};

writeFileSync(join(statusDir, 'index.html'), JSON.stringify(status));
writeFileSync(join(healthDir, 'index.html'), 'ok');

console.log('Generated /status and /health for', commitSha);
