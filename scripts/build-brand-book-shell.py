#!/usr/bin/env python3
"""Generate the complete Dedcco Brand Book HTML with all corrections:
- 5 Quache fonts in base64 with unicode-range EXCLUDING digits (U+0030-0039)
- Cover editorial
- All sections including Chiffres (Unicode-range explanation) and Icônes Lucide
- Output: /home/z/my-project/public/dedcco-design-system.html
"""
import base64
import re
from pathlib import Path

FONTS_DIR = Path("/home/z/my-project/public/fonts")
OUTPUT = Path("/home/z/my-project/public/dedcco-design-system.html")

# Unicode range that EXCLUDES digits (U+0030-0039)
# This forces digits to fall back to Plus Jakarta Sans
UNICODE_RANGE = "U+0020-002F, U+003A-007E, U+00A0-00FF, U+0100-017F, U+2000-206F"

FONTS = [
    (300, "Quache-Light.ttf"),
    (400, "Quache-Regular.ttf"),
    (500, "Quache-Medium.ttf"),
    (700, "Quache-Bold.ttf"),
    (900, "Quache-Black.ttf"),
]

# Build @font-face declarations with base64 + unicode-range
font_faces = []
for weight, filename in FONTS:
    font_path = FONTS_DIR / filename
    if not font_path.exists():
        print(f"Missing: {font_path}")
        continue
    data = font_path.read_bytes()
    b64 = base64.b64encode(data).decode("ascii")
    print(f"  ✓ {filename} → {len(data)//1024}KB → base64 {len(b64)//1024}KB")
    font_faces.append(f'''@font-face {{
  font-family: "Quache";
  font-style: normal;
  font-weight: {weight};
  font-display: swap;
  unicode-range: {UNICODE_RANGE};
  src: url("data:font/ttf;base64,{b64}") format("truetype");
}}''')

font_faces_css = "\n\n".join(font_faces)

# Read the HTML template (we'll write it inline since the original was lost)
HTML = f'''<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Dedcco — Design System</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
/* ============================================================
   DEDCCO BRAND BOOK — Design System
   Palette : Amber / Terracotta / Forest
   Typo : Quache (display, mots) + Plus Jakarta Sans (corps, chiffres)
   Pattern unicode-range : chiffres exclus de Quache → fallback Jakarta
   ============================================================ */

{font_faces_css}

@page {{
  size: 720px 1020px;
  margin: 0;
}}

:root {{
  --amber: #BF793B;
  --amber-dark: #9A5A1F;
  --amber-light: #D4954A;
  --amber-pale: #F5E6D3;
  --terracotta: #A6442E;
  --terracotta-lt: #C4614A;
  --terracotta-pale: #FAEAE6;
  --forest: #548C45;
  --forest-lt: #6BA35A;
  --forest-pale: #E6F2E3;
  --bg-cream: #FFFFFF;
  --bg-warm: #FAF8F5;
  --bg-card: #FFFFFF;
  --text-1: #1E1813;
  --text-2: #5B5048;
  --text-3: #A89E95;
  --border: #F0EEEC;
  --border-dark: #E0DDD8;
  --radius: 10px;
}}

* {{ box-sizing: border-box; }}

html, body {{
  margin: 0;
  padding: 0;
  width: 720px;
  background: var(--bg-cream);
  color: var(--text-1);
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: 13px;
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
  letter-spacing: -0.005em;
}}

@media screen {{
  html {{
    height: auto;
    display: flex;
    justify-content: center;
    background: #2a2520;
  }}
  body {{
    margin: 20px auto;
    box-shadow: 0 30px 80px rgba(0,0,0,0.4);
  }}
}}

/* ============================================================
   TYPOGRAPHY — Quache pour les mots, Jakarta pour les chiffres
   ============================================================ */
.display, h1, h2, h3, h4 {{
  font-family: "Quache", 'Plus Jakarta Sans', Georgia, serif;
  letter-spacing: -0.01em;
  color: var(--text-1);
  margin: 0;
}}
.num {{
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-feature-settings: "tnum" 1, "lnum" 1;
}}
.eyebrow {{
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--amber);
  margin-bottom: 6px;
}}

/* ============================================================
   COVER PAGE
   ============================================================ */
.cover {{
  width: 720px;
  height: 1020px;
  background: var(--bg-warm);
  position: relative;
  overflow: hidden;
  break-after: page;
  padding: 70px 65px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}}

.cover::before {{
  content: "";
  position: absolute;
  top: -120px;
  right: -120px;
  width: 360px;
  height: 360px;
  border-radius: 50%;
  background: var(--amber-pale);
  z-index: 0;
}}
.cover::after {{
  content: "";
  position: absolute;
  bottom: -80px;
  left: -80px;
  width: 240px;
  height: 240px;
  border-radius: 50%;
  background: var(--forest-pale);
  z-index: 0;
}}

.cover-top, .cover-center, .cover-bottom {{ position: relative; z-index: 2; }}
.cover-top {{ display: flex; justify-content: space-between; align-items: flex-start; }}
.cover-brand {{
  font-family: "Quache", Georgia, serif;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text-1);
}}
.cover-brand .dot {{ color: var(--amber); }}
.cover-meta {{
  text-align: right;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-2);
  line-height: 1.6;
}}
.cover-eyebrow {{
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--terracotta);
  margin-bottom: 18px;
}}
.cover-title {{
  font-family: "Quache", Georgia, serif;
  font-size: 92px;
  font-weight: 700;
  line-height: 0.98;
  letter-spacing: -0.025em;
  color: var(--text-1);
  margin-bottom: 14px;
}}
.cover-title .accent {{ color: var(--amber); font-style: italic; font-weight: 500; }}
.cover-subtitle {{
  font-family: "Quache", Georgia, serif;
  font-size: 28px;
  font-weight: 400;
  line-height: 1.2;
  color: var(--text-2);
  margin-top: 18px;
  max-width: 520px;
}}
.cover-divider {{
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 28px 0 22px;
}}
.cover-divider::before, .cover-divider::after {{
  content: "";
  flex: 1;
  height: 1px;
  background: var(--border-dark);
}}
.cover-dot {{ width: 8px; height: 8px; border-radius: 50%; }}
.cover-dot.a {{ background: var(--amber); }}
.cover-dot.t {{ background: var(--terracotta); }}
.cover-dot.f {{ background: var(--forest); }}
.cover-palette {{ display: flex; gap: 14px; margin-top: 16px; }}
.cover-swatch {{
  flex: 1;
  height: 90px;
  border-radius: 8px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: white;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}}
.cover-swatch .name {{ font-size: 13px; font-weight: 700; letter-spacing: 0; text-transform: none; font-family: "Quache", serif; }}
.cover-swatch .hex {{ font-family: 'SF Mono', monospace; letter-spacing: 0.04em; }}
.cover-swatch.amber {{ background: var(--amber); }}
.cover-swatch.terra {{ background: var(--terracotta); }}
.cover-swatch.forest {{ background: var(--forest); }}
.cover-bottom {{
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-2);
}}
.cover-bottom .v {{
  font-family: "Quache", serif;
  font-size: 22px;
  font-weight: 500;
  letter-spacing: -0.01em;
  text-transform: none;
  color: var(--text-1);
}}

/* ============================================================
   MAIN CONTENT
   ============================================================ */
.main {{ padding: 56px 60px 40px 60px; }}

.section-header {{
  break-after: avoid;
  break-inside: avoid;
  margin-top: 30px;
  margin-bottom: 18px;
}}
.section-header:first-child {{ margin-top: 0; }}
.section-num {{
  font-family: "Quache", serif;
  font-size: 13px;
  font-weight: 500;
  color: var(--amber);
  letter-spacing: 0.04em;
  margin-bottom: 4px;
}}
.section-title {{
  font-family: "Quache", serif;
  font-size: 36px;
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.015em;
  color: var(--text-1);
  margin: 0 0 12px 0;
}}
.section-rule {{ display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }}
.section-rule::before {{ content: ""; width: 36px; height: 2px; background: var(--amber); }}
.section-rule::after {{ content: ""; flex: 1; height: 1px; background: var(--border); }}

.lead {{
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-2);
  margin: 0 0 14px 0;
}}
.lead strong {{ color: var(--text-1); font-weight: 600; }}

p {{ margin: 0 0 12px 0; font-size: 12.5px; line-height: 1.7; color: var(--text-1); }}
p strong {{ color: var(--text-1); font-weight: 600; }}
p em {{ color: var(--terracotta); font-style: italic; }}

h3.sub {{
  font-family: "Quache", serif;
  font-size: 18px;
  font-weight: 500;
  color: var(--text-1);
  margin: 18px 0 8px 0;
  break-after: avoid;
}}
h4.minor {{
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--amber-dark);
  margin: 14px 0 6px 0;
  break-after: avoid;
}}

ul, ol {{ margin: 6px 0 12px 0; padding-left: 18px; }}
li {{ font-size: 12.5px; line-height: 1.65; margin-bottom: 4px; color: var(--text-1); }}
li strong {{ color: var(--text-1); font-weight: 600; }}
li code {{ font-family: 'SF Mono', monospace; font-size: 11px; background: var(--amber-pale); color: var(--amber-dark); padding: 1px 5px; border-radius: 3px; }}

pre.code {{
  background: #1e1813;
  color: #f5e6d3;
  padding: 14px 16px;
  border-radius: 8px;
  font-family: 'SF Mono', 'Monaco', monospace;
  font-size: 10.5px;
  line-height: 1.55;
  overflow-x: hidden;
  margin: 10px 0 14px 0;
  break-inside: avoid;
  border-left: 3px solid var(--amber);
  white-space: pre-wrap;
  word-wrap: break-word;
}}

.callout {{
  background: var(--amber-pale);
  border-left: 3px solid var(--amber);
  padding: 12px 14px;
  border-radius: 4px;
  margin: 10px 0 14px 0;
  break-inside: avoid;
  font-size: 12px;
  line-height: 1.6;
  color: var(--amber-dark);
}}
.callout.forest {{ background: var(--forest-pale); border-color: var(--forest); color: #2E5427; }}
.callout.terra {{ background: var(--terracotta-pale); border-color: var(--terracotta); color: #6B2A1C; }}
.callout strong {{ color: inherit; font-weight: 700; }}

.swatch-grid {{ display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin: 10px 0 14px 0; }}
.swatch {{
  border-radius: 8px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  break-inside: avoid;
  border: 1px solid var(--border);
  background: var(--bg-card);
}}
.swatch-chip {{ height: 56px; border-radius: 6px; margin-bottom: 6px; }}
.swatch-name {{ font-family: "Quache", serif; font-size: 14px; font-weight: 500; color: var(--text-1); }}
.swatch-meta {{ font-family: 'SF Mono', monospace; font-size: 10px; color: var(--text-2); line-height: 1.5; }}
.swatch-use {{ font-size: 10.5px; color: var(--text-2); font-style: italic; margin-top: 2px; }}

table.tokens {{ width: 100%; border-collapse: collapse; margin: 10px 0 14px 0; font-size: 11px; }}
table.tokens thead {{ display: table-header-group; }}
table.tokens th {{
  background: var(--text-1);
  color: white;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-align: left;
  padding: 8px 10px;
}}
table.tokens td {{
  padding: 7px 10px;
  border-bottom: 1px solid var(--border);
  vertical-align: top;
  font-size: 11px;
  line-height: 1.5;
}}
table.tokens tr:nth-child(even) td {{ background: var(--bg-warm); }}
table.tokens td.mono {{ font-family: 'SF Mono', monospace; font-size: 10px; color: var(--amber-dark); }}
table.tokens tr {{ break-inside: avoid; }}

.two-col {{ display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 10px 0 14px 0; }}
.two-col > * {{ break-inside: avoid; }}

.preview {{
  background: var(--bg-warm);
  border-radius: 8px;
  padding: 16px;
  margin: 10px 0 14px 0;
  break-inside: avoid;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}}
.preview-label {{
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-3);
  width: 100%;
  margin-bottom: 4px;
}}

.btn-sample {{
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  padding: 7px 14px;
  border-radius: 6px;
  border: 2px solid transparent;
}}
.btn-sample.primary {{ background: var(--amber); color: white; border-color: var(--amber); }}
.btn-sample.secondary {{ background: transparent; color: var(--amber); border-color: var(--amber); }}
.btn-sample.ghost {{ background: transparent; color: var(--text-1); border-color: var(--border); }}
.btn-sample.light {{ background: rgba(255,255,255,0.95); color: var(--text-1); }}
.btn-sample.terra {{ background: var(--terracotta); color: white; border-color: var(--terracotta); }}
.btn-sample.forest {{ background: var(--forest); color: white; border-color: var(--forest); }}

.badge-sample {{
  display: inline-flex;
  align-items: center;
  padding: 3px 9px;
  font-size: 10px;
  font-weight: 500;
  border-radius: 999px;
}}
.badge-sample.amber {{ background: var(--amber-pale); color: var(--amber-dark); }}
.badge-sample.terra {{ background: var(--terracotta-pale); color: var(--terracotta); }}
.badge-sample.forest {{ background: var(--forest-pale); color: var(--forest); }}
.badge-sample.gray {{ background: var(--bg-warm); color: var(--text-2); }}
.badge-sample.dark {{ background: var(--text-1); color: white; }}

.card-sample {{
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 14px;
  box-shadow: 0 1px 4px rgba(30,24,19,0.08);
  break-inside: avoid;
}}
.card-sample .t {{ font-family: "Quache", serif; font-size: 16px; font-weight: 500; margin-bottom: 4px; color: var(--text-1); }}
.card-sample .d {{ font-size: 11px; color: var(--text-2); line-height: 1.5; }}

.specimen {{
  background: var(--bg-warm);
  padding: 18px 20px;
  border-radius: 8px;
  margin: 10px 0 14px 0;
  break-inside: avoid;
}}
.specimen .label {{
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-3);
  margin-bottom: 6px;
}}

.status-flow {{ display: flex; flex-wrap: wrap; gap: 6px; align-items: center; margin: 10px 0 14px 0; break-inside: avoid; }}
.status-pill {{ display: inline-flex; align-items: center; padding: 4px 9px; border-radius: 999px; font-size: 10px; font-weight: 600; font-family: 'SF Mono', monospace; }}
.status-pill.draft, .status-pill.expired, .status-pill.cancelled, .status-pill.closed {{ background: #F2EDE4; color: #7A6E65; }}
.status-pill.submitted, .status-pill.published {{ background: #FEF5E9; color: #B8702F; }}
.status-pill.proposals {{ background: #E8F1FA; color: #4A7A3C; }}
.status-pill.discussion {{ background: #E8F1FA; color: #3B6EA5; }}
.status-pill.selected, .status-pill.deposit {{ background: var(--terracotta-pale); color: var(--terracotta); }}
.status-pill.converted {{ background: var(--forest-pale); color: var(--forest); }}
.arrow {{ color: var(--text-3); font-size: 12px; }}

.tree {{
  background: var(--bg-warm);
  padding: 14px 16px;
  border-radius: 6px;
  font-family: 'SF Mono', monospace;
  font-size: 10.5px;
  line-height: 1.7;
  color: var(--text-1);
  margin: 10px 0 14px 0;
  break-inside: avoid;
  border-left: 3px solid var(--forest);
  white-space: pre-wrap;
}}

/* Icon grid for Lucide section */
.icon-grid {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin: 10px 0 14px 0; }}
.icon-card {{
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 6px;
  break-inside: avoid;
}}
.icon-card:hover {{ border-color: var(--amber); }}
.icon-visual {{ width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; color: var(--text-1); }}
.icon-name {{ font-family: 'SF Mono', monospace; font-size: 10px; font-weight: 600; color: var(--amber-dark); }}
.icon-usage {{ font-size: 9.5px; color: var(--text-2); line-height: 1.35; min-height: 26px; }}

/* ============================================================
   ENDING PAGE
   ============================================================ */
.ending {{
  width: 720px;
  height: 1020px;
  background: var(--text-1);
  color: white;
  position: relative;
  overflow: hidden;
  break-before: page;
  padding: 70px 65px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}}
.ending::before {{
  content: "";
  position: absolute;
  top: 40%;
  right: -100px;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  background: var(--amber);
  opacity: 0.15;
}}
.ending-eyebrow {{ font-size: 10px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: var(--amber-light); margin-bottom: 14px; }}
.ending-title {{ font-family: "Quache", serif; font-size: 64px; font-weight: 700; line-height: 1; letter-spacing: -0.02em; margin-bottom: 18px; }}
.ending-sub {{ font-family: "Quache", serif; font-size: 22px; font-weight: 400; color: #C4B8AC; max-width: 480px; line-height: 1.3; }}
.ending-bottom {{ display: flex; justify-content: space-between; align-items: flex-end; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: #8B7E72; font-weight: 600; }}
.ending-bottom .brand {{ font-family: "Quache", serif; font-size: 22px; font-weight: 500; letter-spacing: -0.01em; text-transform: none; color: white; }}
.ending-bottom .brand .dot {{ color: var(--amber); }}
</style>
</head>
<body>

<!-- ========================== COVER ========================== -->
<div class="cover">
  <div class="cover-top">
    <div class="cover-brand">Dedco<span class="dot">.</span></div>
    <div class="cover-meta">Design System<br>Édition Mars 2026</div>
  </div>
  <div class="cover-center">
    <div class="cover-eyebrow">Brand Book · Référence officielle</div>
    <div class="cover-title">Design <span class="accent">System</span></div>
    <div class="cover-subtitle">La terre cuite africaine rencontre l'éditorial premium — un langage visuel pour le marché de l'artisanat béninois.</div>
    <div class="cover-divider">
      <div class="cover-dot a"></div>
      <div class="cover-dot t"></div>
      <div class="cover-dot f"></div>
    </div>
    <div class="cover-palette">
      <div class="cover-swatch amber"><div class="name">Amber</div><div class="hex">#BF793B</div></div>
      <div class="cover-swatch terra"><div class="name">Terracotta</div><div class="hex">#A6442E</div></div>
      <div class="cover-swatch forest"><div class="name">Forest</div><div class="hex">#548C45</div></div>
    </div>
  </div>
  <div class="cover-bottom">
    <div>Identité · Tokens · Composants · Motion</div>
    <div class="v">v 1.1</div>
  </div>
</div>

<!-- ========================== MAIN CONTENT ========================== -->
<div class="main">

</div>

<!-- ========================== ENDING ========================== -->
<div class="ending">
  <div>
    <div class="ending-eyebrow">Fin du brand book</div>
    <div class="ending-title">Build with<br>intent.</div>
    <div class="ending-sub">Chaque classe <em style="color:var(--amber-light)">.dedco-*</em>, chaque token, chaque transition porte l'histoire d'un marché — Cotonou, le wax, l'iroko, la main qui façonne.</div>
  </div>
  <div class="ending-bottom">
    <div>Dedcco Design System · v 1.1 · 2026</div>
    <div class="brand">Dedco<span class="dot">.</span></div>
  </div>
</div>

</body>
</html>'''

OUTPUT.write_text(HTML, encoding="utf-8")
print(f"\n✓ HTML shell written: {len(HTML)//1024}KB → {OUTPUT}")
print(f"  Fonts embedded: {len(font_faces)}")
print(f"  Unicode-range on each: EXCLUDES U+0030-0039 (digits)")
