# mod 产物说明

## 目录结构

每个 mod 是一个目录：`your_mods/<mod名>/`，包含两个文件：

- `manifest.json` — mod 元信息
- `content.json` — mod 内容（物品）

## manifest.json

mod 元信息，字段：

- `name` — mod 名
- `version` — 版本号
- `description` — 描述（一句话说明这个 mod 做什么）
- `author` — 作者

## content.json

mod 内容，字段：

- `items` — 物品数组，每个元素的字段见 `docs/items.md`

> 字段的必填/格式/命名等约束由 `validate_mod` 工具校验——做错了会返回 FAIL + 定位到具体字段，照着改即可。
