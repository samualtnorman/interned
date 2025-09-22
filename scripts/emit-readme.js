#!/usr/bin/env node
import { readFileSync, writeFileSync } from "fs"

const packageName = process.argv[2]

if (!packageName)
	process.exit(1)

writeFileSync(1, readFileSync(0, { encoding: `utf8` }).replaceAll(`{PACKAGE_NAME}`, packageName))
