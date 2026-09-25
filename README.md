# Fake Game Mod 工作区

Fake Game 的 modding 环境。玩家（和 AI agent）在这个环境里就能直接做 mod：读 `docs/` 了解格式，在 `your_mods/<mod名>/` 下产出 mod，用 `validate_mod` 工具校验。

结构说明见 `AGENTS.md`；做 mod 的详细操作手册见 `.pi/skills/mod-authoring/SKILL.md`。

## 环境声明（`mod-repo.json`）

| 字段 | 值 | 说明 |
|---|---|---|
| `modType` | `json` | 产物是 JSON，**无需编译**（`compile: null`） |
| `modInstall` | `null` | 游戏直接读 `your_mods/<mod名>/content.json`，**没有"安装"这一步** |
| `workshop.supported` | `false` | 本游戏**没有创意工坊** —— 工具据此不要求、也不报告 `workshopDir` |

## 更新工作区之后

工作区里的工具（`.pi/extensions/**`）**只在会话启动时加载**。所以更新之后：

- **新开**一个会话：直接就是最新工具；
- **已经在跑的**会话：点「更新」后产品会自动让它重新加载一次（notice 里会说明重载了几个会话）；
  如果没看到，重开该会话即可。

<!-- [测试用 2026-09-25] 仅用于验证「更新工作区 → 会话自动重载」链路；清理时可整行删除。 -->
