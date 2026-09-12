# Fake Game Mod 工作区

这是虚构游戏 **Fake Game** 的 modding 环境，mod 以 JSON 定义物品，无编译或额外运行时依赖。

## 资料导航

- `docs/`：游戏机制、字段说明；`docs/data-layer.md` 说明手写数据层。
- `reference/example_mod/`：可复用样例；产物格式与字段见 `.pi/skills/mod-authoring/SKILL.md`。
- `mod-repo.json`：机器可读的游戏与环境声明。
- `.pi/skills/mod-authoring/`：制作、修改和校验的领域方法，任务需要时读取。
- `.pi/extensions/`：环境检查、安装指引、mod 校验、装进游戏（`install_mod`，本类型为空壳：无需安装）；以工具声明的能力/副作用为准。

## 工作区边界

资料、示例和工具实现由维护者管理，agent 不修改。`your_mods/` 是玩家成果区，但不是所有 session 的共同写入授权：**是否允许写入、授权到哪个 mod 目录，以当前 session 的角色和绑定为准**。Game Helper 可以查阅资料和制作方法，不编辑 mod 源文件。
