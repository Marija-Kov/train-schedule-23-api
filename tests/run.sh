#!/usr/bin/env bash
set -euo pipefail

find ./ -type f -name '*.test.js' -print0 |
  while IFS= read -r -d '' file; do
    echo "Running: $file"
    node "$file"
  done