/**
 * try_set_game_dir —— 本 repo 是 **JSON mod type 的空壳**：没有游戏安装目录，也没有 mod 安装目标
 * （产出靠 validate_mod 在工作区内校验）。工具存在是为了满足路径工具契约（每个 mod repo 都提供），
 * 行为上明确说明「无需定位」，并且**什么都不写**。
 *
 * 有真实游戏目录的类型（csharp-dll 等）请见 templates/mod-repo 的骨架：
 * 判据放 `.pi/lib/game-paths.ts`，由 check_game_paths / try_set_game_dir / set_game_dir / check_runtime / install_mod 共用。
 */
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

export default function (pi: ExtensionAPI) {
  pi.registerTool({
    name: "try_set_game_dir",
    label: "Ensure Game Directory",
    description:
      "In this JSON-only workspace there is no game install directory, so there is nothing to locate or record. This tool is an explicit no-op for contract compatibility: it confirms the type needs no game directory and writes nothing.",
    promptSnippet: "Ensure the game directory is recorded (no-op in this workspace)",
    promptGuidelines: [
      "This workspace has no game install directory: try_set_game_dir always reports that there is nothing to locate and writes nothing.",
      "If the player asks where the game or a mod goes, explain that this JSON mod type is validated in the workspace by validate_mod rather than installed into a game folder.",
    ],
    parameters: Type.Object({}),
    async execute() {
      return {
        content: [
          {
            type: "text",
            text: "PASS: no game directory in this JSON mod type - there is nothing to locate or record. Nothing was written.",
          },
        ],
        details: { ok: true, notRequired: true, wroteState: false },
      };
    },
  });
}
