/**
 * try_set_game_paths —— 本 repo 是 **JSON mod type 的空壳**：没有游戏安装目录可定位，
 * 因此没有可记录的东西。工具存在是为了满足路径工具契约，行为上明确说明"无需定位"，
 * 并且**什么都不写**（不创建 .gamer-agent.local.json）。
 */
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

export default function (pi: ExtensionAPI) {
  pi.registerTool({
    name: "try_set_game_paths",
    label: "Set Game Paths",
    description:
      "Locate and record the game install directory. In this JSON-only workspace there is no game install directory, so there is nothing to locate or record. This tool is an explicit no-op for contract compatibility: it writes nothing.",
    promptSnippet: "Find and record the game/mod directories (writes state)",
    promptGuidelines: [
      "This workspace has no game install directory: try_set_game_paths always reports that there is nothing to locate and writes nothing. Do not pass guessed paths.",
      "If the player asks where a mod should go, explain that this JSON mod type is validated in the workspace by validate_mod rather than installed into a game folder.",
    ],
    parameters: Type.Object({
      gameDir: Type.Optional(Type.String({ description: "Ignored in this workspace: there is no game install directory." })),
    }),
    async execute() {
      return {
        content: [
          {
            type: "text",
            text: "PASS: no game install directory in this JSON mod type — nothing to locate and nothing was written.",
          },
        ],
        details: { ok: true, notRequired: true, wroteState: false },
      };
    },
  });
}
