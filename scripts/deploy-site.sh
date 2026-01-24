#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SITE_DIR="$ROOT_DIR/apps/site"
DIST_DIR="$SITE_DIR/dist"
DOCS_DIR="$ROOT_DIR/docs"

pnpm install
pnpm site:build

rm -rf "$DOCS_DIR"
mkdir -p "$DOCS_DIR"
cp -R "$DIST_DIR"/. "$DOCS_DIR"/

# Ensure GitHub Pages bypasses Jekyll
: > "$DOCS_DIR/.nojekyll"

echo "Deployed site to $DOCS_DIR"
