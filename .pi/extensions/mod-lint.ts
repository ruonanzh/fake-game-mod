import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, basename, resolve } from "node:path";

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
    description: "Read and validate manifest.json and content.json in an existing mod directory against specs/mod-spec.md. Resolve relative modDir from the workspace root. No files are modified, no compilation or game execution occurs. Returns ok/errors/warnings plus status/checks/nextAction; PASS means static validation only.",
    promptSnippet: "Check an existing JSON mod's fields and naming without modifying files",
    promptGuidelines: [
      "Use validate_mod when relevant mod content has changed or validation is requested. Read errors and nextAction; do not repeat an unchanged failing check indefinitely.",
    ],
    parameters: Type.Object({
      modDir: Type.String({ minLength: 1, description: "Existing mod directory; absolute or relative to workspace root, e.g. your_mods/my_mod (not relative to the skill)." }),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
      if (!params.modDir.trim()) throw new Error("INVALID_MOD_DIR: Provide an existing mod directory, e.g. your_mods/my_mod.");
      const modDir = resolve(ctx.cwd, params.modDir);
      const errors: string[] = [];

      if (!statSync(modDir, { throwIfNoEntry: false })?.isDirectory()) {
        return {
          content: [{ type: "text", text: `FAIL: ${modDir} is not a directory. Check the session's bound path or ask the player to restore it; do not create a replacement merely to validate.` }],
          details: { ok: false, status: "blocked", errors: [`${modDir} is not a directory`], warnings: [], nextAction: "Provide an existing directory; relative paths use the workspace root." },
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
            if (!item || typeof item !== "object" || Array.isArray(item)) {
              errors.push(`items[${i}] must be an object with id, name and type`);
              return;
            }
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
      if (ok) lines.push(`PASS: ${basename(modDir)} is valid (static JSON checks only; not tested in-game).`);
      const nextAction = ok
        ? "Report the static validation result; do not claim in-game testing was performed."
        : "Read the reported fields and specs/mod-spec.md. Correct source only in an authorized mod session, then validate again; do not modify other mods.";
      lines.push(`NEXT: ${nextAction}`);
      return {
        content: [{ type: "text", text: lines.join("\n") }],
        details: { ok, errors, warnings: [], status: ok ? "passed" : "failed", checks: { static: ok ? "passed" : "failed", gameRuntime: "not_run" }, nextAction },
      };
    },
  });
}
