# Fake Game Mod 工作区

这是 **Fake Game** 的 modding 环境。Fake Game 是一个虚构游戏，mod 通过向游戏添加「物品」来扩展内容。

## 结构
- `docs/`     游戏文档（数据格式、机制）
- `specs/`    mod 制作规范（目录结构、manifest/content 格式、命名约定）
- `lint/`     mod 校验工具（`python lint/check_mod.py <mod路径>`）
- `reference/` 官方示例 mod

## 做 mod
你的每个 mod 都放在 `your_mods/<mod名>/` 下（**唯一可写目录**，环境其余部分只读）。

流程：
1. 先读 `docs/` 和 `specs/` 了解数据格式与规范
2. 在 `your_mods/<mod名>/` 下创建 `manifest.json` 和 `content.json`
3. 用 `python lint/check_mod.py your_mods/<mod名>/` 校验，产物打印到标准输出
4. 环境只读，别把中间文件写回 `lint/`、`docs/` 等目录
