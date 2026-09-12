import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

/**
 * install_mod — mod 安装契约（docs/mod-repo-guide.md §4.1）
 *
 * json mod type 的 `modInstall` 为 null：游戏直接从 your_mods/<mod名>/ 读取内容，没有安装目标，
 * 所以这里只如实说明「无需安装」——与 validate_mod / check_runtime 一样是**明确的空壳**，
 * 不让 agent 误以为漏做了一步。
 *
 * 若将来该类型出现安装目标（mod-repo.json 的 modInstall 不为 null），本工具必须按 §4.1 实现：
 * - 目标目录来自 check_runtime 写进 .gamer-agent.local.json 的 modInstallDir（不自己探测）
 * - 装完在目标目录写 .pi-mod.json（id = <modType>:<manifest.json 的 name>，含 installedDir 等）
 * - 重装/升级：先按 id 扫 mod 根下的标记找到上次装到哪 → 就地更新（目录名不漂移）
 * - 目标被别的 mod 占用 → **改名安装**到 <mod名>_pimod（再撞顺延 _pimod2…），**绝不覆盖别人的内容**；
 *   本类型约定 `manifest.json` 的 name 必须 = 目录名，所以改名时要**同步把副本的 name 改成新目录名**，
 *   否则副本自身不合法（参考 escape-from-duckov-mod / eu5-mod-repo 的实现）。
 */
export default function (pi: ExtensionAPI) {
  pi.registerTool({
    name: "install_mod",
    label: "Install Mod",
    description:
      "Report that this JSON mod type has no install target (modInstall: null) because the game reads content straight from your_mods/<name>/. This tool is a no-op: it copies nothing and modifies no files.",
    promptSnippet: "Explain that this JSON mod type needs no installation step",
    promptGuidelines: [
      "Do not routinely call install_mod for this workspace: this mod type has no install target, so a mod under your_mods/ is already usable.",
      "If a task asks how to get the mod into the game, explain that this JSON mod type is read from your_mods/ directly; validate_mod is still what proves the mod is well-formed.",
    ],
    parameters: Type.Object({
      modDir: Type.String({ description: "Mod directory, e.g. your_mods/<ModName> (unused for this mod type)." }),
    }),
    async execute(_toolCallId, params) {
      void params;
      return {
        content: [
          {
            type: "text",
            text: "PASS: this modType (json) has no install target (modInstall: null); nothing to copy.\nNEXT: run the game to load the mod content directly from your_mods/.",
          },
        ],
        details: { ok: true, installed: false, reason: "NO_INSTALL_TARGET" },
      };
    },
  });
}
