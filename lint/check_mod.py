#!/usr/bin/env python3
"""Fake Game mod 校验工具。

用法：python lint/check_mod.py <mod路径>

校验 mod 的 manifest.json 和 content.json 是否符合 specs/mod-spec.md。
结果打印到标准输出；通过返回 0，失败返回 1。
"""
import json
import re
import sys
from pathlib import Path

ITEM_TYPES = {"weapon", "armor", "consumable"}
NAME_RE = re.compile(r"^[a-z][a-z0-9_]*$")
SEMVER_RE = re.compile(r"^\d+\.\d+\.\d+$")


def main(mod_dir: Path) -> int:
    if not mod_dir.is_dir():
        print(f"FAIL: {mod_dir} 不是目录")
        return 1

    errors = []

    # manifest.json
    manifest_path = mod_dir / "manifest.json"
    if not manifest_path.is_file():
        errors.append("缺少 manifest.json")
    else:
        try:
            manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        except Exception as exc:
            errors.append(f"manifest.json 不是合法 JSON: {exc}")
        else:
            for key in ("name", "version", "description", "author"):
                if not manifest.get(key):
                    errors.append(f"manifest.{key} 缺失或为空")
            if not SEMVER_RE.match(manifest.get("version", "")):
                errors.append(f"manifest.version 不是 semver: {manifest.get('version')!r}")
            if manifest.get("name") != mod_dir.name:
                errors.append(f"manifest.name ({manifest.get('name')!r}) 与目录名 ({mod_dir.name}) 不一致")
            if not NAME_RE.match(manifest.get("name", "")):
                errors.append(f"manifest.name 不符合 lower_snake_case: {manifest.get('name')!r}")

    # content.json
    content_path = mod_dir / "content.json"
    if not content_path.is_file():
        errors.append("缺少 content.json")
    else:
        try:
            content = json.loads(content_path.read_text(encoding="utf-8"))
        except Exception as exc:
            errors.append(f"content.json 不是合法 JSON: {exc}")
        else:
            items = content.get("items")
            if not isinstance(items, list) or not items:
                errors.append("content.items 必须是非空数组")
            else:
                seen = set()
                for i, item in enumerate(items):
                    prefix = f"items[{i}]"
                    if not isinstance(item, dict):
                        errors.append(f"{prefix} 必须是对象")
                        continue
                    for key in ("id", "name", "type"):
                        if not item.get(key):
                            errors.append(f"{prefix}.{key} 缺失或为空")
                    itype = item.get("type")
                    if itype not in ITEM_TYPES:
                        errors.append(f"{prefix}.type 必须是 {sorted(ITEM_TYPES)} 之一，得到 {itype!r}")
                    iid = item.get("id", "")
                    if not NAME_RE.match(iid):
                        errors.append(f"{prefix}.id 不符合 lower_snake_case: {iid!r}")
                    if iid in seen:
                        errors.append(f"{prefix}.id 重复: {iid!r}")
                    seen.add(iid)

    if errors:
        for error in errors:
            print(f"FAIL: {error}")
        return 1

    print(f"PASS: {mod_dir.name} 校验通过")
    return 0


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(2)
    sys.exit(main(Path(sys.argv[1])))
