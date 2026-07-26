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

const featureFlags = {
  task: 'T15',
  flagName: 'FEATURE_SHOW_INSIGHTS',
  showInsights,
  redacted: true,
};

const status = {
  task: 'T01',
  team: teamName,
  commit: commitSha,
  releaseId,
  deployTime,
  tasks: ['T01', 'T02', 'T05', 'T10', 'T15'],
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
  featureFlags,
};

const statusDir = join(distDir, 'status');
const healthDir = join(distDir, 'health');
const configDir = join(distDir, 'config');
mkdirSync(statusDir, { recursive: true });
mkdirSync(healthDir, { recursive: true });
mkdirSync(configDir, { recursive: true });

writeFileSync(join(statusDir, 'index.html'), JSON.stringify(status));
writeFileSync(join(distDir, 'status.json'), JSON.stringify(status, null, 2));
writeFileSync(join(healthDir, 'index.html'), 'ok');
writeFileSync(join(configDir, 'feature-flags.json'), JSON.stringify(featureFlags));

console.log('Generated /status, /health, and /config/feature-flags.json for', commitSha);
