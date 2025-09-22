#!/usr/bin/env bash
set -ex
rm dist --recursive --force
mkdir dist --parents
JSR=1 ./rolldown.config.js
scripts/emit-dts.sh
cp LICENSE dist
scripts/emit-readme.js @sn/interned < src/readme.md | scripts/prepend-readme.js dist/default.d.ts
scripts/emit-jsr-json.js
