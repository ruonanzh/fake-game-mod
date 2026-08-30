# mod 制作规范

## 目录结构

每个 mod 是一个目录：`your_mods/<mod名>/`，至少包含两个文件：

- `manifest.json` — mod 元信息
- `content.json` — mod 内容（物品）

## manifest.json

```json
{
  "name": "<mod名>",
  "version": "0.1.0",
  "description": "<描述>",
  "author": "<作者>"
}
```

- `name`：必填，`lower_snake_case`，与目录名一致。
- `version`：必填，semver（`x.y.z`）。
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

- `items` 必须是非空数组，每个元素见 `docs/items.md`。

## 命名约定

- mod 名：`lower_snake_case`，与 `your_mods/` 下的目录名一致。
- 物品 `id`：`lower_snake_case`，全局唯一。

> 本规范的可执行版是 `validate_mod` 工具——这里每条约束，它都要能校验。
