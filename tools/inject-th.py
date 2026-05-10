#!/usr/bin/env python3
"""One-shot injector: take the Thai JSON returned by the authoring sub-agent
and graft descriptionTh + traitsTh fields into data/archetypes.js next to
the existing description + traits per archetype.

Idempotent: skips archetypes that already have descriptionTh.
"""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data" / "archetypes.js"

# Thai content from the sub-agent. The agent escaped <strong> as &lt;strong&gt;
# so we unescape on the way in.
TH = json.loads(sys.stdin.read())


def unescape(s: str) -> str:
    return s.replace("&lt;", "<").replace("&gt;", ">").replace("&amp;", "&")


def js_string(s: str) -> str:
    """Render a Python string as a double-quoted JS string literal."""
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'


def render_th_fields(code: str) -> str:
    entry = TH[code]
    desc = unescape(entry["descriptionTh"])
    traits = entry["traitsTh"]
    trait_lines = []
    for title, body in traits:
        trait_lines.append(
            f'                [{js_string(unescape(title))}, {js_string(unescape(body))}],'
        )
    return (
        f'            descriptionTh: {js_string(desc)},\n'
        f'            traitsTh: [\n'
        + "\n".join(trait_lines) + "\n"
        f'            ],\n'
    )


src = DATA.read_text()

# For each archetype, find the block from `code: "XXXX",` to the next
# standalone `        },` (the close of that archetype object). Insert the
# Thai fields right before the close.
for code in TH.keys():
    # Skip if already injected
    if f'code: "{code}",' not in src:
        print(f"⚠ {code}: code field not found, skipping")
        continue
    if re.search(rf'code: "{code}",[\s\S]*?descriptionTh:', src):
        print(f"= {code}: descriptionTh already present, skipping")
        continue

    pattern = re.compile(
        rf'(            code: "{code}",[\s\S]*?\n)(        \}},)',
        re.MULTILINE,
    )
    m = pattern.search(src)
    if not m:
        print(f"⚠ {code}: closing brace not found")
        continue

    th_block = render_th_fields(code)
    src = src[: m.start(2)] + th_block + src[m.start(2):]
    print(f"✓ {code}")

DATA.write_text(src)
print(f"\nWrote {DATA}")
