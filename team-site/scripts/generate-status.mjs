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
const domainConnected = Boolean(publicUrl && publicUrl.startsWith('https://'));
const web3FormsConfigured = Boolean(process.env.VITE_WEB3FORMS_ACCESS_KEY);
const showInsights = process.env.VITE_FEATURE_SHOW_INSIGHTS === 'true';

const status = {
  task: 'T01',
  team: teamName,
  commit: commitSha,
  releaseId,
  deployTime,
  publicUrlConfigured: Boolean(publicUrl),
  secretsRedacted: true,
  domain: {
    publicUrl,
    connected: domainConnected,
  },
  contact: {
    provider: 'web3forms',
    configured: web3FormsConfigured,
  },
  featureFlags: {
    task: 'T15',
    showInsights,
    valueRedacted: true,
  },
};

const statusDir = join(distDir, 'status');
const healthDir = join(distDir, 'health');
mkdirSync(statusDir, { recursive: true });
mkdirSync(healthDir, { recursive: true });

writeFileSync(join(statusDir, 'index.html'), JSON.stringify(status));
writeFileSync(join(distDir, 'status.json'), JSON.stringify(status, null, 2));
writeFileSync(join(healthDir, 'index.html'), 'ok');

console.log('Generated /status and /health for', commitSha);
