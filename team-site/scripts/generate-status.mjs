import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');

const teamName = process.env.TEAM_NAME || 'codebreak';
const commitSha = process.env.GITHUB_SHA || 'local-dev';
const releaseId = process.env.GITHUB_RUN_ID || `local-${Date.now()}`;
const deployTime = new Date().toISOString();

const publicUrl = process.env.VITE_PUBLIC_URL || process.env.PUBLIC_URL || null;
const runtimeConfig = {
  task: 'T05',
  publicUrlConfigured: Boolean(publicUrl),
  secretsRedacted: true,
};

const statusDir = join(distDir, 'status');
const healthDir = join(distDir, 'health');
mkdirSync(statusDir, { recursive: true });
mkdirSync(healthDir, { recursive: true });

writeFileSync(
  join(statusDir, 'index.html'),
  `<!doctype html><html><body><pre>${JSON.stringify(runtimeConfig, null, 2)}</pre></body></html>`,
);
writeFileSync(join(distDir, 'status.json'), JSON.stringify(runtimeConfig, null, 2));
writeFileSync(join(healthDir, 'index.html'), 'ok');

console.log('Generated /status and /health for', commitSha);
