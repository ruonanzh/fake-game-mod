import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

/**
 * check_runtime — 运行时契约（docs/mod-repo-guide.md §4）
 * json mod type 无运行时依赖，直接 PASS。
 * 有依赖的类型（如 csharp-dll 需 dotnet）：在 execute 里用 node:child_process
 * 探测 dotnet（多位置）+ 按 mod-repo.json 发现游戏目录，结果写运行时状态文件。
 */
export default function (pi: ExtensionAPI) {
  pi.registerTool({
    name: "check_runtime",
    label: "Check Runtime",
    description: "Report runtime prerequisites for this JSON-only game workspace. There are no extra SDK or compiler dependencies. No files are written and no software is installed; this does not validate a mod or test gameplay.",
    promptSnippet: "Report runtime prerequisites when the player asks about environment setup",
    promptGuidelines: ["Use check_runtime only when setup information is needed; JSON mod authoring here has no extra runtime prerequisites."],
    parameters: Type.Object({}),
    async execute() {
      return { content: [{ type: "text", text: "PASS: no runtime dependencies. No installation or mod validation was performed." }], details: { ok: true } };
    },
  });
}
