#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
bundle_dir="$(mktemp -d)"
output_dir="$repo_dir/dist"
trap 'rm -rf "$bundle_dir"' EXIT

mkdir -p "$bundle_dir/src" "$output_dir"
cp "$repo_dir/src/mcp.js" "$repo_dir/src/client.js" "$bundle_dir/src/"
cp "$repo_dir/mcpb/manifest.json" "$repo_dir/mcpb/package.json" "$bundle_dir/"
npm install --prefix "$bundle_dir" --omit=dev --no-audit --no-fund
npx --yes @anthropic-ai/mcpb@2.1.2 pack "$bundle_dir" "$output_dir/shire-automations.mcpb"
