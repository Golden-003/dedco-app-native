#!/usr/bin/env python3
"""Fix the @font-face declarations: add unicode-range to exclude digits (U+0030-0039).
This forces digits to fall back to Plus Jakarta Sans, like on the real Dedcco site."""
import re
from pathlib import Path

HTML_PATH = Path("/home/z/my-project/scripts/dedcco-brand-book.html")
html = HTML_PATH.read_text(encoding="utf-8")

# Pattern: each @font-face has src: url("data:...") but no unicode-range
# Add unicode-range BEFORE the src line, for each @font-face

# The unicode-range that EXCLUDES digits (U+0030-0039)
UNICODE_RANGE = 'unicode-range: U+0020-002F, U+003A-007E, U+00A0-00FF, U+0100-017F, U+2000-206F;'

# For each @font-face block, insert unicode-range before src:
def add_unicode_range(match):
    block = match.group(0)
    if 'unicode-range' in block:
        return block  # already has it
    # Insert before src:
    return block.replace('  src:', f'  {UNICODE_RANGE}\n  src:')

# Match each @font-face { ... } block
new_html, count = re.subn(r'@font-face\s*\{[^}]+\}', add_unicode_range, html)
print(f"Added unicode-range to {count} @font-face blocks")

HTML_PATH.write_text(new_html, encoding="utf-8")
print(f"Updated HTML: {len(new_html)//1024}KB")

# Verify
import re
for i, m in enumerate(re.finditer(r'@font-face\s*\{[^}]+\}', new_html)):
    block = m.group(0)
    has_ur = 'unicode-range' in block
    weight_m = re.search(r'font-weight:\s*(\d+)', block)
    weight = weight_m.group(1) if weight_m else '?'
    print(f"  @font-face weight={weight}: unicode-range={'✓' if has_ur else '✗'}")
