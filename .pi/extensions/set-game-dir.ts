/**
 * set_game_dir —— 本 repo 是 **JSON mod type 的空壳**：没有游戏安装目录可记录（产出靠 validate_mod
 * 在工作区内校验）。工具存在是为了满足路径工具契约（每个 mod repo 都提供），行为上明确说明
 * 「无需记录」，并且**什么都不写**。
 *
 * 有真实游戏目录的类型（csharp-dll 等）请见 templates/mod-repo 的骨架。
 */
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

export default function (pi: ExtensionAPI) {
  pi.registerTool({
    name: "set_game_dir",
    label: "Set Game Directory",
    description:
      "In this JSON-only workspace there is no game install directory to record. This tool is an explicit no-op for contract compatibility: it records nothing and writes nothing.",
    promptSnippet: "Record a specific game directory (no-op in this workspace)",
    promptGuidelines: [
      "This workspace has no game install directory: set_game_dir always reports that there is nothing to record and writes nothing. Do not pass a path.",
    ],
    parameters: Type.Object({
      path: Type.String({ description: "Ignored in this workspace: there is no game install directory." }),
    }),
    async execute() {
      return {
        content: [
          {
            type: "text",
            text: "PASS: no game directory in this JSON mod type - there is nothing to record. Nothing was written.",
          },
        ],
        details: { ok: true, notRequired: true, wroteState: false },
      };
    },
  });
}
