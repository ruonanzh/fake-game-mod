import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, basename } from "node:path";

const ITEM_TYPES = new Set(["weapon", "armor", "consumable"]);
const NAME_RE = /^[a-z][a-z0-9_]*$/;
const SEMVER_RE = /^\d+\.\d+\.\d+$/;

function readJson(filePath: string): unknown | null {
  try {
    return JSON.parse(readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

/**
 * validate_mod — mod 校验工具（json mod type）。
 * 校验 manifest.json + content.json 是否符合 specs/mod-spec.md。
 * 契约见 docs/mod-repo-guide.md §3.1。
 */
export default function (pi: ExtensionAPI) {
  pi.registerTool({
    name: "validate_mod",
    label: "Validate Mod",
    description: "Validate a mod (manifest.json + content.json against specs/mod-spec.md)",
    promptSnippet: "Validate a mod under your_mods/",
    promptGuidelines: [
      "Use validate_mod after writing a mod to check it passes the spec.",
    ],
    parameters: Type.Object({
      modDir: Type.String({ description: "Path to the mod directory (e.g. your_mods/<ModName>)" }),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, _ctx) {
      const modDir = params.modDir;
      const errors: string[] = [];

      if (!statSync(modDir, { throwIfNoEntry: false })?.isDirectory()) {
        return {
          content: [{ type: "text", text: `FAIL: ${modDir} is not a directory` }],
          details: { ok: false, errors: [`${modDir} is not a directory`], warnings: [] },
        };
      }

      // manifest.json
      const manifest = readJson(join(modDir, "manifest.json")) as Record<string, unknown> | null;
      if (manifest === null) {
        errors.push("manifest.json is missing or not valid JSON");
      } else {
        for (const key of ["name", "version", "description", "author"]) {
          if (!manifest[key]) errors.push(`manifest.${key} is missing or empty`);
        }
        if (manifest.version && !SEMVER_RE.test(String(manifest.version))) {
          errors.push(`manifest.version is not semver x.y.z: ${JSON.stringify(manifest.version)}`);
        }
        if (manifest.name !== basename(modDir)) {
          errors.push(`manifest.name (${JSON.stringify(manifest.name)}) does not match dir name (${basename(modDir)})`);
        }
        if (manifest.name && !NAME_RE.test(String(manifest.name))) {
          errors.push(`manifest.name is not lower_snake_case: ${JSON.stringify(manifest.name)}`);
        }
      }

      // content.json
      const content = readJson(join(modDir, "content.json")) as { items?: unknown } | null;
      if (content === null) {
        errors.push("content.json is missing or not valid JSON");
      } else {
        const items = content.items;
        if (!Array.isArray(items) || items.length === 0) {
          errors.push("content.items must be a non-empty array");
        } else {
          const seen = new Set<string>();
          items.forEach((item, i) => {
            const it = item as Record<string, unknown>;
            for (const key of ["id", "name", "type"]) {
              if (!it[key]) errors.push(`items[${i}].${key} is missing or empty`);
            }
            if (it.type && !ITEM_TYPES.has(String(it.type))) {
              errors.push(`items[${i}].type must be one of [${[...ITEM_TYPES].sort().join(", ")}], got ${JSON.stringify(it.type)}`);
            }
            const id = String(it.id ?? "");
            if (id && !NAME_RE.test(id)) errors.push(`items[${i}].id is not lower_snake_case: ${JSON.stringify(id)}`);
            if (seen.has(id)) errors.push(`items[${i}].id is duplicated: ${JSON.stringify(id)}`);
            if (id) seen.add(id);
          });
        }
      }

      const ok = errors.length === 0;
      const lines = errors.map((e) => `FAIL: ${e}`);
      if (ok) lines.push(`PASS: ${basename(modDir)} is valid`);
      return {
        content: [{ type: "text", text: lines.join("\n") }],
        details: { ok, errors, warnings: [] },
      };
    },
  });
}
