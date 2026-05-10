#!/usr/bin/env python3
"""Generate 1200x630 Open Graph images for each archetype.

Reads data/archetypes.js (via Node), renders one PNG per archetype to
assets/og/<code>.png. Designed to be run locally (requires Pillow).

Usage:  python3 tools/build-og.py
"""

import json
import subprocess
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "og"
ILLUS_DIR = ROOT / "assets" / "personalities"
W, H = 1200, 630

# Fonts (macOS system). Fallback to default if missing.
FONT_DISPLAY_BLACK = "/System/Library/Fonts/Avenir Next.ttc"      # 4 = Heavy
FONT_DISPLAY_BOLD  = "/System/Library/Fonts/Avenir Next.ttc"      # 0 = Regular, 1 = Italic, 2 = Bold
FONT_BODY          = "/System/Library/Fonts/Helvetica.ttc"
FONT_THAI          = "/System/Library/Fonts/Supplemental/Thonburi.ttc"


def load_archetypes():
    """Read data/archetypes.js by booting it under Node and serializing."""
    code = (
        "global.window={};require('./data/archetypes.js');"
        "process.stdout.write(JSON.stringify("
        "global.window.MeowArchetypes.all.map(a=>({"
        "code:a.code,name:a.name,tagline:a.tagline,"
        "color:a.color,bg:a.bg,slug:a.slug"
        "}))))"
    )
    out = subprocess.check_output(["node", "-e", code], cwd=ROOT)
    return json.loads(out)


def font(path, size, index=0):
    try:
        return ImageFont.truetype(path, size, index=index)
    except Exception:
        return ImageFont.load_default()


def text_size(draw, text, fnt):
    bbox = draw.textbbox((0, 0), text, font=fnt)
    return bbox[2] - bbox[0], bbox[3] - bbox[1]


def wrap(draw, text, fnt, max_w):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        candidate = (cur + " " + w).strip()
        if text_size(draw, candidate, fnt)[0] > max_w and cur:
            lines.append(cur)
            cur = w
        else:
            cur = candidate
    if cur:
        lines.append(cur)
    return lines


def render(archetype):
    code = archetype["code"]
    color = archetype["color"]
    bg = archetype["bg"]
    name = archetype["name"]
    tagline = archetype["tagline"]
    slug = archetype["slug"]

    # Canvas — archetype color background
    img = Image.new("RGB", (W, H), color)
    draw = ImageDraw.Draw(img, "RGBA")

    # Subtle dot pattern overlay (matches site's home-grain motif)
    for y in range(0, H, 14):
        offset = 7 if (y // 14) % 2 else 0
        for x in range(offset, W, 14):
            draw.ellipse((x - 1.4, y - 1.4, x + 1.4, y + 1.4), fill=(255, 255, 255, 22))

    # Right-side illustration card
    illu_path = ILLUS_DIR / f"{code.lower()}-{slug}.webp"
    if illu_path.exists():
        with Image.open(illu_path).convert("RGBA") as illu:
            # Card frame on the right
            card_w, card_h = 460, 460
            card_x = W - card_w - 60
            card_y = (H - card_h) // 2
            # White rounded backing with thick ink border
            card_bg = Image.new("RGBA", (card_w, card_h), (0, 0, 0, 0))
            card_draw = ImageDraw.Draw(card_bg)
            radius = 36
            ink = (31, 20, 16, 255)
            # Soft drop shadow
            shadow = Image.new("RGBA", (card_w + 24, card_h + 24), (0, 0, 0, 0))
            sd = ImageDraw.Draw(shadow)
            sd.rounded_rectangle((12, 12, 12 + card_w, 12 + card_h), radius=radius, fill=(0, 0, 0, 90))
            shadow = shadow.filter(ImageFilter.GaussianBlur(8))
            img.paste(shadow, (card_x - 12, card_y - 12), shadow)
            # Card body in archetype's soft bg color
            card_draw.rounded_rectangle((0, 0, card_w, card_h), radius=radius,
                                        fill=tuple(int(bg[i:i+2], 16) for i in (1, 3, 5)) + (255,),
                                        outline=ink, width=8)
            img.paste(card_bg, (card_x, card_y), card_bg)
            # Fit illustration inside card with padding
            pad = 30
            inner_w = card_w - pad * 2
            inner_h = card_h - pad * 2
            illu.thumbnail((inner_w, inner_h), Image.LANCZOS)
            ix = card_x + (card_w - illu.width) // 2
            iy = card_y + (card_h - illu.height) // 2
            img.paste(illu, (ix, iy), illu)

    # Left side: code, name, tagline
    code_font = font(FONT_DISPLAY_BLACK, 180, index=4)
    name_font = font(FONT_DISPLAY_BLACK, 64,  index=4)
    tag_font  = font(FONT_DISPLAY_BOLD, 30,  index=1)
    wm_font   = font(FONT_DISPLAY_BLACK, 28, index=4)
    cert_font = font(FONT_BODY, 18, index=1)

    left_pad = 70
    text_max_w = 580

    # Top wordmark (emoji omitted — PIL needs explicit Apple Color Emoji font)
    draw.text((left_pad, 50), "MEOWBTI", fill=(255, 255, 255, 255), font=wm_font)

    # Top-right cert stamp
    cert_text = f"CERT №{abs(hash(code)) % 900000 + 100000}"
    cw, _ = text_size(draw, cert_text, cert_font)
    draw.text((W - 60 - cw, 60), cert_text, fill=(255, 255, 255, 230), font=cert_font)

    # Big code
    draw.text((left_pad, 130), code, fill=(255, 255, 255, 255), font=code_font)

    # Name (wrap if needed)
    name_lines = wrap(draw, name, name_font, text_max_w)
    y = 360
    for line in name_lines:
        draw.text((left_pad, y), line, fill=(255, 255, 255, 255), font=name_font)
        y += 70

    # Tagline (italic, opacity)
    y += 8
    tag_lines = wrap(draw, f'"{tagline}"', tag_font, text_max_w)
    for line in tag_lines[:3]:
        draw.text((left_pad, y), line, fill=(255, 255, 255, 240), font=tag_font)
        y += 38

    # Bottom-left: "1 of 16"
    draw.text((left_pad, H - 60), "1 of 16  ·  meowbti.com",
              fill=(255, 255, 255, 200), font=cert_font)

    OUT.mkdir(parents=True, exist_ok=True)
    out_path = OUT / f"{code}.png"
    img.save(out_path, "PNG", optimize=True)
    return out_path


def main():
    archetypes = load_archetypes()
    print(f"Generating OG images for {len(archetypes)} archetypes…")
    for a in archetypes:
        path = render(a)
        size_kb = path.stat().st_size // 1024
        print(f"✓ {a['code']}.png  ({size_kb} KB)")
    print(f"\nWrote {len(archetypes)} files to {OUT.relative_to(ROOT)}/")


if __name__ == "__main__":
    main()
