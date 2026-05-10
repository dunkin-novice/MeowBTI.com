#!/usr/bin/env python3
"""Inject per-archetype Thai field translations (nameTh, taglineTh, vibesTh,
famouslySaysTh, kindredSpiritsTh, redFlagsTh, greenFlagsTh) into
data/archetypes.js. Idempotent: skips entries that already have nameTh.

Usage:  python3 tools/inject-th-fields.py < /tmp/meowbti-th-fields.json
"""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data" / "archetypes.js"

TH = json.loads(sys.stdin.read())


def js_string(s: str) -> str:
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'


def js_string_array(arr) -> str:
    return "[" + ", ".join(js_string(x) for x in arr) + "]"


def render_th_fields(code: str) -> str:
    e = TH[code]
    return (
        f'            nameTh: {js_string(e["nameTh"])},\n'
        f'            taglineTh: {js_string(e["taglineTh"])},\n'
        f'            vibesTh: {js_string_array(e["vibesTh"])},\n'
        f'            famouslySaysTh: {js_string(e["famouslySaysTh"])},\n'
        f'            kindredSpiritsTh: {js_string_array(e["kindredSpiritsTh"])},\n'
        f'            redFlagsTh: {js_string(e["redFlagsTh"])},\n'
        f'            greenFlagsTh: {js_string(e["greenFlagsTh"])},\n'
    )


src = DATA.read_text()

for code in TH.keys():
    if f'code: "{code}",' not in src:
        print(f"⚠ {code}: not in data file")
        continue
    if re.search(rf'code: "{code}",[\s\S]*?nameTh:', src):
        print(f"= {code}: nameTh already present, skipping")
        continue

    # Anchor on the existing greenFlags line (unique per archetype).
    pattern = re.compile(
        rf'(            code: "{code}",[\s\S]*?            greenFlags: "[^"]*",\n)',
    )
    m = pattern.search(src)
    if not m:
        print(f"⚠ {code}: greenFlags anchor not found")
        continue

    th_block = render_th_fields(code)
    src = src[: m.end()] + th_block + src[m.end():]
    print(f"✓ {code}")

DATA.write_text(src)
print(f"\nWrote {DATA}")
