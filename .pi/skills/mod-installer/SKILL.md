---
name: mod-installer
description: Fake Game 的 mod **没有安装这一步**：游戏直接从 `your_mods/<mod名>/` 读取 `content.json`。当玩家问「怎么让 mod 生效 / mod 装在哪 / 要不要装一下」时读取 —— 用来解释为什么无需安装，而不是去找安装步骤。
---

# 装进游戏？本类型没有这一步

`mod-repo.json` 里 `modInstall: null` —— **Fake Game 没有 mod 安装目标**，游戏直接读 `your_mods/<mod名>/content.json`。

- `install_mod` 是**如实说明「无需安装」的空壳**：不要机械调用它，也不要把它当成漏做的一步。
- 玩家问「怎么让 mod 生效」→ 按 `docs/game.md` 的数据流解释：游戏**启动时扫描合并**，物品 `id` 全局唯一、重复会覆盖。
- 玩家问「mod 装在哪」→ 就是工作区里的 `your_mods/<mod名>/` 本身。

## 相关技能

- 产物本身怎么写/怎么校验 → `mod-creator`。
- 「这里要不要准备环境」→ `setup-workspace`。
