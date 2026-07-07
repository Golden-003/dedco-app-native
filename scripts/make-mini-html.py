#!/usr/bin/env python3
"""Create a minimal compact HTML — system fonts, no base64, no inline SVG, minified CSS.
Target: under 25 KB so it can be downloaded through IM."""
import re
from pathlib import Path

src = Path("/home/z/my-project/scripts/dedcco-brand-book.html").read_text(encoding="utf-8")

# 1. Strip all comments
src = re.sub(r'/\*[\s\S]*?\*/', '', src)
src = re.sub(r'<!--[\s\S]*?-->', '', src)

# 2. Remove base64 font src, replace with system serif
src = re.sub(r'src:\s*url\("data:font/ttf;base64,[^"]+"\)\s*format\("truetype"\);',
             'src:local("Playfair Display"),local("Georgia");', src)

# 3. Replace Google Fonts preconnect/link with just Playfair Display
src = re.sub(r'<link rel="preconnect"[^>]*>\s*', '', src)
src = re.sub(r'<link href="https://fonts.googleapis.com/css2\?family=Plus\+Jakarta\+Sans[^"]*"[^>]*>',
             '<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700&family=Playfair+Display:wght@400;700;900&display=swap" rel="stylesheet">', src)

# 4. Minify CSS - collapse whitespace
def minify_css(match):
    css = match.group(1)
    # Remove whitespace
    css = re.sub(r'\s+', ' ', css)
    css = re.sub(r'\s*([{}:;,])\s*', r'\1', css)
    css = re.sub(r';}', '}', css)
    return f'<style>{css}</style>'

src = re.sub(r'<style>([\s\S]*?)</style>', minify_css, src)

# 5. Minify HTML body whitespace (preserve <pre>)
def minify_html(text):
    # Don't touch pre/code blocks
    parts = re.split(r'(<pre[^>]*>[\s\S]*?</pre>)', text)
    for i, p in enumerate(parts):
        if p.startswith('<pre'):
            continue
        # Collapse multiple whitespace
        p = re.sub(r'\s+', ' ', p)
        p = re.sub(r'>\s+<', '><', p)
        parts[i] = p
    return ''.join(parts)

src = minify_html(src)

# 6. Remove icon-card SVGs and replace with text labels (icons take ~30KB)
# Find icon-card divs and simplify
def simplify_icon_card(match):
    full = match.group(0)
    # Extract icon-name and icon-usage
    name_m = re.search(r'<div class="icon-name">([^<]+)</div>', full)
    usage_m = re.search(r'<div class="icon-usage">([^<]+)</div>', full)
    name = name_m.group(1) if name_m else ''
    usage = usage_m.group(1) if usage_m else ''
    return f'<div class="icon-card"><div class="icon-visual">◆</div><div class="icon-name">{name}</div><div class="icon-usage">{usage}</div></div>'

src = re.sub(r'<div class="icon-card">[\s\S]*?</div>\s*</div>\s*</div>', simplify_icon_card, src)
# Also catch the simpler pattern
src = re.sub(r'<div class="icon-card"><div class="icon-visual"><svg[^>]*>[\s\S]*?</svg></div>', 
             '<div class="icon-card"><div class="icon-visual">◆</div>', src)

# 7. Final whitespace cleanup
src = re.sub(r'\n{3,}', '\n\n', src)

out = Path("/home/z/my-project/download/dedcco-mini.html")
out.write_text(src, encoding="utf-8")
print(f"Mini HTML: {len(src)} chars ({len(src)//1024}KB) → {out}")
