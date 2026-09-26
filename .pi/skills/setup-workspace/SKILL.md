---
name: setup-workspace
description: Fake Game 是 JSON 类型：没有游戏安装目录、没有运行时依赖、也没有安装目标。当需要确认「要不要检查环境/路径」、或玩家问「mod 装在哪 / 需要装什么」时读取 —— 答案是这里不需要任何环境准备。
---

# 环境与路径（Fake Game = JSON 类型）

**本类型不需要环境准备**：没有游戏安装目录、没有运行时依赖、也没有 mod 安装目标。
产出在 `your_mods/<mod名>/` 里完成，用 `validate_mod` 在工作区内校验，**不往任何游戏目录里装**。

## 路径工具在这里是明确空壳

| 工具 | 在这里的行为 |
|---|---|
| `check_game_paths` | 返回「无需验证」；**不读、不写、不创建**任何东西 |
| `set_game_paths` | 返回「无需定位」；**不写状态文件** |

要点：

- 不要给它们传猜测的路径，也不要因为它们的输出而去创建目录。
- 玩家问「mod 装在哪」→ 说明这个类型是在工作区内产出并用 `validate_mod` 校验，**没有游戏安装目标**。
- **运行时**：此 JSON 类型没有额外运行时依赖；正常制作**无需**机械调用 `check_runtime` / `install_runtime`。玩家明确询问环境时才用工具核实。

## 真正有游戏目录的类型

见 `templates/mod-repo` 的骨架：判据放 `.pi/lib/game-paths.ts`，由 `check_game_paths` / `set_game_paths` / `check_runtime` / `install_mod` 共用。

## 相关技能

- 做 mod 本身 → `mod-creator`。
- 「怎么让 mod 生效」→ `mod-installer`。
