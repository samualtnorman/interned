#!/usr/bin/env -S node --experimental-strip-types
import { mkdirSync as makeDirectorySync, writeFileSync } from "fs"
import packageJson from "../package.json" with { type: "json" }

const { version, license } = packageJson

makeDirectorySync("dist", { recursive: true })

writeFileSync("dist/jsr.json", JSON.stringify(
	{ name: `@sn/interned`, version, license, exports: { ".": "./default.js" } },
	undefined,
	"\t"
))
