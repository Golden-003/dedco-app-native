#!/usr/bin/env python3
"""Inject Quache fonts as base64 data URIs into the brand book HTML."""
import base64
import re
from pathlib import Path

HTML_PATH = Path("/home/z/my-project/scripts/dedcco-brand-book.html")
FONTS_DIR = Path("/home/z/my-project/public/fonts")

# Map font-weight → file
FONTS = {
    300: "Quache-Light.ttf",
    400: "Quache-Regular.ttf",
    500: "Quache-Medium.ttf",
    700: "Quache-Bold.ttf",
    900: "Quache-Black.ttf",
}

def font_to_base64(weight, filename):
    """Read font file, return base64 data URI."""
    font_path = FONTS_DIR / filename
    if not font_path.exists():
        print(f"  ✗ Missing: {font_path}")
        return None
    with open(font_path, "rb") as f:
        data = f.read()
    b64 = base64.b64encode(data).decode("ascii")
    print(f"  ✓ {filename} → {len(data)//1024}KB → {len(b64)//1024}KB base64")
    return f"data:font/ttf;base64,{b64}"

# Read HTML
html = HTML_PATH.read_text(encoding="utf-8")
print(f"Original HTML: {len(html)//1024}KB")

# Replace each @font-face src line
for weight, filename in FONTS.items():
    b64 = font_to_base64(weight, filename)
    if b64 is None:
        continue
    # Pattern: src: url("file:///home/z/my-project/public/fonts/Quache-XXX.ttf") format("truetype");
    pattern = rf'src:\s*url\("file:///home/z/my-project/public/fonts/{re.escape(filename)}"\)\s*format\("truetype"\);'
    replacement = f'src: url("{b64}") format("truetype");'
    new_html, count = re.subn(pattern, replacement, html)
    if count == 0:
        print(f"  ✗ Pattern not found for {filename}")
    else:
        html = new_html
        print(f"  ✓ Replaced {count} occurrence(s) for {filename}")

# Write back
HTML_PATH.write_text(html, encoding="utf-8")
print(f"\nFinal HTML: {len(html)//1024}KB")
print("Done. Quache fonts are now embedded as base64 data URIs.")
