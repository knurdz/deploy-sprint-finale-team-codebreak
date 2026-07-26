#!/usr/bin/env bash
set -euo pipefail

base_url="${PUBLIC_URI:?PUBLIC_URI required}"

echo "Running T19 smoke tests against: $base_url"

echo "Checking $base_url/"
curl --fail --show-error --silent "$base_url/" > /dev/null && echo "  OK: /"

echo "Checking $base_url/health"
curl --fail --show-error --silent "$base_url/health" > /dev/null && echo "  OK: /health"

echo "Checking $base_url/status"
curl --fail --show-error --silent "$base_url/status" > /dev/null && echo "  OK: /status"

echo "T19 smoke tests passed"