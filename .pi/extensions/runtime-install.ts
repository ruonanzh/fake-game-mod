import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

/**
 * install_runtime — 运行时契约（docs/mod-repo-guide.md §4）
 * json mod type 无需安装，直接 SKIP。
 * 有依赖的类型：给安装指令（用户级 ~/.dotnet 优先，无权限），系统级备选。
 * 只管引导装，不管删。
 */
export default function (pi: ExtensionAPI) {
  pi.registerTool({
    name: "install_runtime",
    label: "Install Runtime",
    description: "Install or guide installation of the mod runtime",
    promptSnippet: "Install mod runtime",
    promptGuidelines: ["Use install_runtime when check_runtime reports a missing runtime."],
    parameters: Type.Object({}),
    async execute() {
      return { content: [{ type: "text", text: "SKIP: no runtime dependencies" }] };
    },
  });
}
