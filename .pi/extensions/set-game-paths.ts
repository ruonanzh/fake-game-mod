/**
 * set_game_paths —— 本 repo 是 **JSON mod type 的空壳**：没有游戏安装目录，也没有 mod 安装目标
 * （产出靠 validate_mod 在工作区内校验）。工具存在是为了满足路径工具契约，行为上明确说明
 * "没有可设置的路径"，并且**什么都不写**。
 *
 * 这个类型不提供单条 setter（set_game_dir / set_workshop_dir / set_mod_install_dir）：
 * 没有路径可设时，多一个入口只会让 agent 多猜。有真实游戏目录的类型见 templates/mod-repo。
 */
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

export default function (pi: ExtensionAPI) {
  pi.registerTool({
    name: "set_game_paths",
    label: "Set Game Paths",
    description:
      "Record game-related directories. In this JSON-only workspace there is no game install directory and no mod install target, so there is nothing to record. This tool is an explicit no-op for contract compatibility: it writes nothing.",
    promptSnippet: "Remember several game paths at once (no-op in this workspace)",
    promptGuidelines: [
      "This workspace has no game directories: set_game_paths always reports that there is nothing to set and writes nothing. Do not pass paths.",
      "If the player asks where a mod goes, explain that this JSON mod type is validated in the workspace by validate_mod rather than installed into a game folder.",
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
            text: "PASS: no game directories in this JSON mod type - there is nothing to record. Nothing was written.",
          },
        ],
        details: { ok: true, notRequired: true, wroteState: false },
      };
    },
  });
}
