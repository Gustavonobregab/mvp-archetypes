#!/usr/bin/env bash
set -euo pipefail

usage() { echo "usage: scripts/deploy-demo.sh <console|saas|marketplace> <slug>" >&2; exit 1; }

[ $# -eq 2 ] || usage
archetype=$1
slug=$2
case "$archetype" in console|saas|marketplace) ;; *) usage ;; esac
[[ "$slug" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]] || { echo "slug must be kebab-case: $slug" >&2; exit 1; }

cd "$(git rev-parse --show-toplevel)"

scope=gustavo-nobregas-projects
project="demo-$slug"
config="deploy/vercel.$archetype.json"

if ! vercel project inspect "$project" --scope "$scope" >/dev/null 2>&1; then
  vercel project add "$project" --scope "$scope" >&2
fi
vercel link --yes --project "$project" --scope "$scope" >&2

deployment=$(vercel deploy --prod --yes --scope "$scope" -A "$config" | tail -1)
alias=$(vercel inspect "$deployment" --scope "$scope" --format json | jq -r '.aliases | sort_by(length) | .[0] // empty')
[ -n "$alias" ] || { echo "no production alias for $deployment" >&2; exit 1; }
url="https://$alias"

status=$(curl -s -o /dev/null -w '%{http_code}' "$url")
[ "$status" = 200 ] || { echo "$url answered $status" >&2; exit 1; }
echo "$url"
