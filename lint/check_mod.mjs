#!/usr/bin/env node
/**
 * Fake Game mod validator.
 *
 * Usage: node lint/check_mod.mjs <mod-path>
 *
 * Validates a mod's manifest.json and content.json against specs/mod-spec.md.
 * Prints the result to stdout. Exit codes: 0 = pass, 1 = fail, 2 = usage error.
 *
 * Contract: read-only (mod + specs), never writes back to lint/ or the
 * environment; zero third-party deps (Node built-in modules only). Messages
 * are ASCII/English to avoid Windows console encoding issues (GBK vs UTF-8).
 */
import { readFileSync, statSync } from "node:fs";
import { join, basename } from "node:path";

const ITEM_TYPES = new Set(["weapon", "armor", "consumable"]);
const NAME_RE = /^[a-z][a-z0-9_]*$/;
const SEMVER_RE = /^\d+\.\d+\.\d+$/;

function main() {
  if (process.argv.length !== 3) {
    console.log("Usage: node lint/check_mod.mjs <mod-path>");
    process.exitCode = 2;
    return;
  }

  const modDir = process.argv[2];
  let isDir = false;
  try {
    isDir = statSync(modDir).isDirectory();
  } catch {
    isDir = false;
  }
  if (!isDir) {
    console.log(`FAIL: ${modDir} is not a directory`);
    process.exitCode = 1;
    return;
  }

  const errors = [];

  // manifest.json
  const manifest = readJson(join(modDir, "manifest.json"), "manifest.json", errors);
  if (manifest !== null) {
    for (const key of ["name", "version", "description", "author"]) {
      if (!manifest[key]) errors.push(`manifest.${key} is missing or empty`);
    }
    if (!SEMVER_RE.test(manifest.version ?? "")) {
      errors.push(`manifest.version is not semver x.y.z: ${JSON.stringify(manifest.version)}`);
    }
    if (manifest.name !== basename(modDir)) {
      errors.push(
        `manifest.name (${JSON.stringify(manifest.name)}) does not match dir name (${basename(modDir)})`,
      );
    }
    if (!NAME_RE.test(manifest.name ?? "")) {
      errors.push(`manifest.name is not lower_snake_case: ${JSON.stringify(manifest.name)}`);
    }
  }

  // content.json
  const content = readJson(join(modDir, "content.json"), "content.json", errors);
  if (content !== null) {
    const items = content.items;
    if (!Array.isArray(items) || items.length === 0) {
      errors.push("content.items must be a non-empty array");
    } else {
      const seen = new Set();
      items.forEach((item, i) => {
        const prefix = `items[${i}]`;
        if (typeof item !== "object" || item === null || Array.isArray(item)) {
          errors.push(`${prefix} must be an object`);
          return;
        }
        for (const key of ["id", "name", "type"]) {
          if (!item[key]) errors.push(`${prefix}.${key} is missing or empty`);
        }
        if (!ITEM_TYPES.has(item.type)) {
          errors.push(
            `${prefix}.type must be one of [${[...ITEM_TYPES].sort().join(", ")}], got ${JSON.stringify(item.type)}`,
          );
        }
        const id = item.id ?? "";
        if (!NAME_RE.test(id)) errors.push(`${prefix}.id is not lower_snake_case: ${JSON.stringify(id)}`);
        if (seen.has(id)) errors.push(`${prefix}.id is duplicated: ${JSON.stringify(id)}`);
        seen.add(id);
      });
    }
  }

  if (errors.length) {
    for (const error of errors) console.log(`FAIL: ${error}`);
    process.exitCode = 1;
    return;
  }
  console.log(`PASS: ${basename(modDir)} is valid`);
  process.exitCode = 0;
}

function readJson(filePath, label, errors) {
  try {
    return JSON.parse(readFileSync(filePath, "utf8"));
  } catch (err) {
    if (err?.code === "ENOENT") errors.push(`missing ${label}`);
    else errors.push(`${label} is not valid JSON: ${err.message}`);
    return null;
  }
}

main();
