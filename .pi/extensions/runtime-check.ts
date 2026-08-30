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
    description: "Check whether the mod runtime is ready (dotnet, game dir, etc.)",
    promptSnippet: "Check mod runtime readiness",
    promptGuidelines: ["Use check_runtime before writing mod code to ensure the runtime is ready."],
    parameters: Type.Object({}),
    async execute() {
      return { content: [{ type: "text", text: "PASS: no runtime dependencies" }] };
    },
  });
}
