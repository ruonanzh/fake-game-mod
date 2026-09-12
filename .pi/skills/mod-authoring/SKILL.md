---
name: mod-authoring
description: Fake Game 的 JSON mod 制作、修改、可行性/制作方法解释与校验排错。任务涉及 manifest.json、content.json、物品字段或 validate_mod 时按需读取；仅咨询不要求创建文件，实际写入取决于 session 权限。
---

# 做 mod（Fake Game）

一个 mod 是 `your_mods/<mod名>/` 目录，含两个文件：

- `manifest.json` — mod 元信息
- `content.json` — mod 内容（物品）

做好后用 `validate_mod` 工具校验。

## 使用方式与条件分支

本技能提供领域方法，不授予权限；Game Helper 可用于解释/校验已有 mod，不能因此创建目录或修改源码。以下路径均相对 workspace 根目录（不是技能目录）。

- **咨询/可行性**：先确定玩家要的效果，检索 `docs/`。不因为读取本技能就创建文件或检查运行时。
- **实际制作/修改**：复用 `reference/example_mod/` 的结构。写入仅限当前 session 绑定目录；无绑定且准备写入时才调 `create_mod_folder`，选择符合规范的 `lower_snake_case` 名字。已有绑定继续使用，缺失目录先说明阻塞，不另建第二个绑定。
- **格式不明**：按需读 `docs/items.md`，再实现 `manifest.json`/`content.json`。合理默认小细节，只有影响主要效果的歧义才询问。
- **运行时**：此 JSON 类型没有额外运行时依赖；正常制作无需机械调用 `check_runtime`/`install_runtime`。玩家明确询问环境时可使用工具核实。
- **验证**：产物完成或相关内容变化后调用 `validate_mod`。依据错误修复；重复失败先查根因，缺外部信息则报告阻塞，不无限重试。
- **装进游戏**：本类型**没有安装这一步**——`modInstall` 为 null，游戏直接从 `your_mods/<mod名>/` 读取 `content.json`。`install_mod` 是如实说明「无需安装」的空壳，不要机械调用，也不要把它当成漏做的一步。玩家问「怎么让 mod 生效」时，按 `docs/game.md` 的数据流解释（启动时扫描合并，物品 id 全局唯一、重复覆盖）。

## manifest.json

```json
{
  "name": "<mod名>",
  "version": "0.1.0",
  "description": "<描述>",
  "author": "<作者>"
}
```

- `name`：mod 名，与目录名一致、`lower_snake_case`（validate_mod 校验）。
- `version`：版本号，semver `x.y.z`（validate_mod 校验）。
- `description`：描述，一句话说明这个 mod 做什么（validate_mod 校验非空）。
- `author`：作者（validate_mod 校验非空）。

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

- `items`：物品数组（validate_mod 校验非空）。每个元素字段见 `docs/items.md`。
- 物品 `id`：`lower_snake_case`，同一 mod 内全局唯一（validate_mod 校验）。

## 命名约定

- mod 名 / 目录名：`lower_snake_case`（validate_mod 校验）。
- 物品 `id`：`lower_snake_case`，全局唯一（validate_mod 校验）。

## validate_mod 工具用法

调 `validate_mod` 工具，参数 `modDir = your_mods/<mod名>/`。

- 返回 `PASS: <名> is valid`：本工具的 JSON 静态检查通过，不代表在游戏内运行过。
- 返回 `FAIL: <原因>`（逐条，英文）：失败，直接指向缺失/不合法的字段；结合 `NEXT:` 行定位，不修改其他 mod。
- 输出含 `FAIL` 时表示校验未通过；最终说明生成内容与实际检查结果，未做的验证明确保留。

## 常见错误（对照修正）

- `FAIL: manifest.name (...) does not match dir name (...)` → name 与目录名不一致，改成一致。
- `FAIL: ... is not lower_snake_case` → name/id 用了大写、连字符或空格，改成 `lower_snake_case`。
- `FAIL: manifest.version is not semver x.y.z` → version 不是三段数字，补全成 `x.y.z`。
- `FAIL: content.items must be a non-empty array` → items 为空，至少一个物品。
- `FAIL: items[i].type must be one of [...]` → type 只允许 `weapon/armor/consumable`。
- `FAIL: items[i].id is duplicated` → id 重复，换个唯一的。

## 参考

- 完整可过校验的样例：`reference/example_mod/`。
- 字段定义：`docs/items.md`。
