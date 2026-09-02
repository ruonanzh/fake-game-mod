# 数据层说明（json 类型）

> 本文说明 fake-game-mod（**json 类型蓝本**）的「数据层」是什么，帮助 repo 作者理解 json vs csharp-dll 两种类型的数据层差异。给开发者看；agent 直接 grep `docs/` 与 `specs/` 即可。

## json 类型没有「生成的数据层」

csharp-dll 类型（如 Escape From Duckov）的 mod repo 有一个**从游戏二进制/资源提取出来的「生成数据层」**：

- `docs/api/` —— 反射 dump 游戏 DLL 的 API 签名（`scripts/inspect_game` 生成）；
- `docs/data/` —— UnityPy 解包游戏数据表 + 资源清单（`scripts/extract_data.py` / `extract_resources.py` 生成）；
- 游戏 patch 后要重跑 `scripts/refresh.py` 刷新。

**json 类型没有这一套**：json 类型的「游戏数据」就是 JSON 字段定义，不需要反射、不需要解包——数据层直接手写在文档里，也没有 refresh.py。

## json 类型的数据层 = 手写的字段定义

| 文件 | 内容 | 角色 |
|---|---|---|
| `docs/game.md` | 游戏机制、数据流 | 机制说明 |
| `docs/items.md` | 物品字段定义（id/name/type/description/stats） | **字段定义**（相当于 csharp-dll 的 `docs/data/` + `docs/api/` 合起来要告诉 agent 的东西） |
| `specs/mod-spec.md` | mod 产物 schema（manifest.json + content.json） | 产物规范 |

一句话：**json 类型的数据层 = `docs/` + `specs/` 里手写的字段定义；没有 `docs/api/` + `docs/data/` 那种「从游戏提取的生成快照」，也就没有 refresh.py 这套刷新工具。**

## 做一个新 json 类型 game repo 时

1. 以本仓库为**蓝本**（比 `templates/mod-repo/` 骨架更完整、带这份参照说明）；
2. 改 `mod-repo.json` 的 `game.name`（`modInstall` / `compile` 保持 null）；
3. 重写 `docs/game.md` + `docs/items.md`（你的游戏的字段定义）；
4. 改 `specs/mod-spec.md` + `.pi/extensions/mod-lint.ts`（校验规则对应你的字段）；
5. 更新 `reference/example_mod/`（可过校验的样例）。
