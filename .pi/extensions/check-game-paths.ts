/**
 * check_game_paths —— 本 repo 是 **JSON mod type 的空壳**：这个游戏工作区没有"游戏安装目录"这种东西，
 * 所以没有可验的路径。工具存在是为了满足路径工具契约（每个 mod repo 都提供），
 * 行为上明确说明"无需验证"，并且**什么都不读、不写、不创建**。
 *
 * 有真实游戏目录的类型（csharp-dll 等）请见 templates/mod-repo 的骨架：
 * 判据放 `.pi/lib/game-paths.ts`，由 check_game_paths / set_game_paths / check_runtime / install_mod 共用。
 */
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

export default function (pi: ExtensionAPI) {
  pi.registerTool({
    name: "check_game_paths",
    description:
      "Verify game-related directories. In this JSON-only workspace there is no game install directory, so there is nothing to verify. This tool is an explicit no-op for contract compatibility: it reads nothing, writes nothing and creates nothing.",
    promptSnippet: "Verify game/mod paths without scanning or writing",
    promptGuidelines: [
      "This workspace has no game install directory: check_game_paths always reports that there is nothing to verify. Do not try to invent paths.",
      "Do not use check_game_paths to decide whether mod files exist - use validate_mod for that.",
    ],
    parameters: Type.Object({
      gameDir: Type.Optional(Type.String({ description: "Ignored in this workspace: there is no game install directory." })),
      workshopDir: Type.Optional(Type.String({ description: "Ignored in this workspace." })),
      modInstallDir: Type.Optional(Type.String({ description: "Ignored in this workspace." })),
    }),
    async execute() {
      return {
        content: [
          {
            type: "text",
            text: "PASS: no game paths in this JSON mod type - there is no game install directory to verify. Nothing was read, written or created.",
          },
        ],
        details: { ok: true, notRequired: true, wroteState: false },
      };
    },
  });
}
