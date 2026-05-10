#!/usr/bin/env python3
"""Merge Thai translations into the QUESTIONS array in quiz-script.js.

Reads JSON from stdin in the shape:
  [{"qTh": "...", "optionsTh": [{"emoji":"...", "text":"..."}, ...]}, ...]

For each question (1-indexed by array order), adds:
  - qTh field on the question object
  - textTh field on each option

Idempotent: skips questions that already have qTh.
"""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
QUIZ = ROOT / "quiz-script.js"

TH = json.loads(sys.stdin.read())
src = QUIZ.read_text()


def js_string(s: str) -> str:
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'


# Find each question block: starts with `q: "...",` and ends with the
# matching closing `},` of the question object.
q_re = re.compile(r'    \{\n        q: "[^"]*",[\s\S]*?\n    \},')
matches = list(q_re.finditer(src))

if len(matches) != len(TH):
    print(f"⚠ found {len(matches)} questions in source but {len(TH)} in JSON")
    sys.exit(1)


def transform_question(block: str, th_data: dict) -> str:
    if 'qTh:' in block:
        return block  # already injected

    # Inject qTh right after the `q: "...",` line
    block = re.sub(
        r'(        q: "[^"]*",\n)',
        lambda m: m.group(1) + f'        qTh: {js_string(th_data["qTh"])},\n',
        block, count=1,
    )

    # Inject textTh into each option, in order. Match each option by its emoji
    # (which is preserved across EN/TH).
    opt_re = re.compile(
        r'(\{ emoji: "([^"]+)", text: "([^"]*)", letter: "([^"]+)" \})',
    )
    th_opts = th_data["optionsTh"]

    def replace_opt(m):
        full, emoji, text, letter = m.groups()
        # Find matching TH option by emoji
        match = next((o for o in th_opts if o["emoji"] == emoji), None)
        if not match:
            return full
        return (
            f'{{ emoji: "{emoji}", text: {js_string(text)}, '
            f'textTh: {js_string(match["text"])}, letter: "{letter}" }}'
        )

    block = opt_re.sub(replace_opt, block)
    return block


# Apply transforms in reverse order (so earlier offsets stay valid)
for i in reversed(range(len(matches))):
    m = matches[i]
    new_block = transform_question(m.group(0), TH[i])
    src = src[:m.start()] + new_block + src[m.end():]
    print(f"✓ Q{i+1}")

QUIZ.write_text(src)
print(f"\nWrote {QUIZ}")
