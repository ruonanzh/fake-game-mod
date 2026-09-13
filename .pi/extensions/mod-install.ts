import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

/**
 * install_mod — mod 安装契约（docs/mod-repo-guide.md §4.1）
 *
 * json mod type 的 `modInstall` 为 null：游戏直接从 your_mods/<mod名>/ 读取内容，没有安装目标，
 * 所以这里只如实说明「无需安装」——与 validate_mod / check_runtime 一样是**明确的空壳**，
 * 不让 agent 误以为漏做了一步。
 *
 * 若将来该类型出现安装目标（mod-repo.json 的 modInstall 不为 null），本工具只需按 §4.1 做三件事：
 * 读 check_runtime 写的 modInstallDir → 复制产物（目标被别的 mod 占用就改名装 <mod 名>_pimod，
 * 绝不覆盖）→ 在目标目录写 .pi-mod.json = { "name": "<mod 名>" }。
 * 不做安装状态管理、不扫目录、不改副本里的 mod 内容；参考实现见 duckov / eu5 两个 repo。
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
      modDir: Type.String({
        description:
          "Mod directory, e.g. your_mods/<ModName> (unused for this mod type).",
      }),
    }),
      // ── 若你的 modType 需要安装（modInstall 非 null），实现时遵守以下四条
      //    （契约见 desktop-gamer-agent-pi/docs/mod-repo-guide.md §4.1）：────────────────
      // 1) 目标目录名用 **your_mods 下的目录名**（不是 mod 声明的身份）：目录名是单层名字、
      //    create_mod_folder 已校验 → 构造上不可能写到 modInstallDir 之外；用 metadata.id /
      //    info.ini 的 name 拼路径时，带 `../` 的身份就能越界写。
      // 2) 绝不覆盖别人的内容：目标被别的 mod 占用 → 改名装 `<目录名>_pimod`（再撞顺延）。
      // 3) 「这目录是不是我上次装的」看目录里的 `.pi-mod.json`，比较的是 **mod 身份**
      //    （marker 存身份），不能用目录名比 —— 否则身份与目录名不同的 mod 会被装成两份。
      // 4) 替换必须事务化：旧版本先 rename 到 `.previous-<pid>`（不删）→ 换入新版本 → 成功后才删；
      //    换入失败把旧版本挪回；入口处恢复上次崩溃留下的孤儿 `.previous-*`（不能当垃圾删）。
      // ─────────────────────────────────────────────────────────────────────────────
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
