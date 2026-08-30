# Fake Game Mod 工作区

这是 **Fake Game** 的 modding 环境。Fake Game 是虚构游戏，mod 通过添加「物品」扩展内容。

## 目录

- `docs/`     游戏机制与数据格式
- `specs/`    mod 制作规范（schema、命名约定）
- `reference/` 官方示例 mod（完整、可过校验的正确答案）
- `.pi/extensions/` 工具（registerTool 注册 `check_runtime` / `install_runtime` / `validate_mod`）
- `mod-repo.json` 机器可读配置（modType/版本/游戏目录声明）
- `your_mods/` **唯一可写目录**，你的每个 mod 放这里（环境其余部分只读）

## 硬规则

mod 只能写到 `your_mods/<mod名>/`，环境的其它目录（docs/specs/.pi/reference）只读。

## 做 mod（流程概览）

1. 先调 `check_runtime` 工具确认环境就绪（本类型无依赖，应返回 PASS）
2. 读 `specs/` 与 `docs/` 了解格式
3. 在 `your_mods/<mod名>/` 下创建 `manifest.json` + `content.json`
4. 调 `validate_mod` 工具校验（返回 PASS 即通过）

详细步骤、字段说明、常见错误见 skill：`.pi/skills/mod-authoring/`（做 mod 时先加载它）。
