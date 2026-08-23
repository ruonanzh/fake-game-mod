# 物品数据格式

物品是一个 JSON 对象：

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| id | string | ✅ | 唯一标识，`lower_snake_case` |
| name | string | ✅ | 显示名 |
| type | string | ✅ | `weapon` / `armor` / `consumable` |
| description | string | ❌ | 描述 |
| stats | object | ❌ | 数值（如 `{"attack": 10}`） |

示例见 `reference/example_mod/content.json`。
