# Fake Game 机制

Fake Game 是一个极简游戏：玩家收集物品。mod 的职责就是添加新物品。

## 数据流

- 游戏启动时扫描每个 mod 的 `content.json`，把其中的 `items` 合并进游戏物品表。
- 物品 `id` 全局唯一，重复会覆盖。
