---
name: mod-authoring
description: 在 Fake Game 的 modding 环境里创建、修改、校验 mod（your_mods/<mod名>/ 下的 manifest.json + content.json）。当任务是在本环境做 mod、跑 lint 校验 mod 时使用。
---

# 做 mod（Fake Game）

在 `your_mods/<mod名>/` 下做一个 mod，用 `lint/check_mod.mjs` 校验。

## 唯一可写目录

`your_mods/<mod名>/` 是唯一可写目录。环境的 `docs/`、`specs/`、`lint/`、`reference/` 一律只读，别把中间文件写回去。

## 步骤

1. 读 `specs/mod-spec.md`（schema + 命名约定）和 `docs/items.md`（字段说明）。
2. 在 `your_mods/<mod名>/` 下创建 `manifest.json`。
3. 在 `your_mods/<mod名>/` 下创建 `content.json`。
4. 校验：`node lint/check_mod.mjs your_mods/<mod名>/`，直到输出 `PASS`（exit 0）。

## manifest.json

```json
{
  "name": "<mod名>",
  "version": "0.1.0",
  "description": "<描述>",
  "author": "<作者>"
}
```

- `name`：必填，`lower_snake_case`，且与目录名**完全一致**。
- `version`：必填，semver `x.y.z`。
- `description`、`author`：必填，非空。

## content.json

```json
{
  "items": [
    {
      "id": "fire_sword",
      "name": "火焰剑",
      "type": "weapon",
      "description": "一把燃烧的剑",
      "stats": { "attack": 10 }
    }
  ]
}
```

- `items` 必须是非空数组。每个元素字段见 `docs/items.md`。
- 物品 `id`：`lower_snake_case`，同一 mod 内全局唯一。

## 命名约定

- mod 名 / 目录名：`lower_snake_case`（`^[a-z][a-z0-9_]*$`）。
- 物品 `id`：`lower_snake_case`，全局唯一。

## lint 用法

```bash
node lint/check_mod.mjs your_mods/<mod名>/
```

- exit `0`：通过，打印 `PASS: <名> is valid`。
- exit `1`：失败，逐条打印 `FAIL: <原因>`（英文），直接指向缺失/不合法的字段。
- exit `2`：用法错误（参数个数不对）。

## 常见错误（对照修正）

- `FAIL: manifest.name (...) does not match dir name (...)` → name 与目录名不一致，改成一致。
- `FAIL: ... is not lower_snake_case` → name/id 用了大写、连字符或空格，改成 `lower_snake_case`。
- `FAIL: manifest.version is not semver x.y.z` → version 不是三段数字，补全成 `x.y.z`。
- `FAIL: content.items must be a non-empty array` → items 为空，至少一个物品。
- `FAIL: items[i].type must be one of [...]` → type 只允许 `weapon/armor/consumable`。
- `FAIL: items[i].id is duplicated` → id 重复，换个唯一的。

## 参考

- 完整可过 lint 的样例：`reference/example_mod/`。
- 字段定义：`docs/items.md`；规范原文：`specs/mod-spec.md`。
