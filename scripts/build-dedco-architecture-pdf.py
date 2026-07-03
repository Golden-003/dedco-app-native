#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Dedco — Architecture Technique & Produit
Génère le PDF body via ReportLab + cover via HTML/Playwright, puis merge.
"""
import os
import sys
import hashlib
import subprocess
from pathlib import Path

# ── Skill scripts on path (for install_font_fallback) ──
PDF_SKILL_DIR = "/home/z/my-project/skills/pdf"
sys.path.insert(0, os.path.join(PDF_SKILL_DIR, "scripts"))

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY, TA_RIGHT
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
    KeepTogether, Image, Flowable, HRFlowable,
)
from reportlab.platypus.tableofcontents import TableOfContents
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
from reportlab.pdfgen import canvas as canvasmod

# ── Font registration ──
FONT_DIR = "/usr/share/fonts"
pdfmetrics.registerFont(TTFont("NotoSerifSC", f"{FONT_DIR}/truetype/noto-serif-sc/NotoSerifSC-Regular.ttf"))
pdfmetrics.registerFont(TTFont("NotoSerifSC-Bold", f"{FONT_DIR}/truetype/noto-serif-sc/NotoSerifSC-Bold.ttf"))
pdfmetrics.registerFont(TTFont("FreeSerif", f"{FONT_DIR}/truetype/freefont/FreeSerif.ttf"))
pdfmetrics.registerFont(TTFont("FreeSerif-Bold", f"{FONT_DIR}/truetype/freefont/FreeSerifBold.ttf"))
pdfmetrics.registerFont(TTFont("FreeSerif-Italic", f"{FONT_DIR}/truetype/freefont/FreeSerifItalic.ttf"))
pdfmetrics.registerFont(TTFont("FreeSerif-BoldItalic", f"{FONT_DIR}/truetype/freefont/FreeSerifBoldItalic.ttf"))
pdfmetrics.registerFont(TTFont("DejaVuSans", f"{FONT_DIR}/truetype/dejavu/DejaVuSansMono.ttf"))

registerFontFamily("NotoSerifSC", normal="NotoSerifSC", bold="NotoSerifSC-Bold")
registerFontFamily("FreeSerif", normal="FreeSerif", bold="FreeSerif-Bold",
                   italic="FreeSerif-Italic", boldItalic="FreeSerif-BoldItalic")
registerFontFamily("DejaVuSans", normal="DejaVuSans", bold="DejaVuSans")

from pdf import install_font_fallback
install_font_fallback()

# ── Dedco brand palette (from brand book) ──
PAGE_BG       = colors.HexColor("#FAF7F2")   # cream
SECTION_BG    = colors.HexColor("#F2EDE4")
CARD_BG       = colors.HexColor("#F7F3ED")
TABLE_STRIPE  = colors.HexColor("#F7F3ED")

# Brand accents
AMBER         = colors.HexColor("#BF793B")
AMBER_DARK    = colors.HexColor("#A66129")
AMBER_PALE    = colors.HexColor("#FEF5E9")
TERRACOTTA    = colors.HexColor("#A6442E")
TERRACOTTA_PALE = colors.HexColor("#FAEAE6")
FOREST        = colors.HexColor("#548C45")
FOREST_PALE   = colors.HexColor("#E6F2E3")

HEADER_FILL   = colors.HexColor("#1E1813")   # ink (dark)
BORDER        = colors.HexColor("#E0D9CC")
BORDER_DARK   = colors.HexColor("#7A7068")

TEXT_PRIMARY  = colors.HexColor("#1E1813")
TEXT_SECOND   = colors.HexColor("#5B5048")
TEXT_MUTED    = colors.HexColor("#7A7068")

# Table colors
TABLE_HEADER_COLOR = HEADER_FILL
TABLE_HEADER_TEXT  = colors.white
TABLE_ROW_EVEN     = colors.white
TABLE_ROW_ODD      = TABLE_STRIPE

# ── Page geometry ──
PAGE_W, PAGE_H = A4
MARGIN_L = 22 * mm
MARGIN_R = 22 * mm
MARGIN_T = 22 * mm
MARGIN_B = 22 * mm
CONTENT_W = PAGE_W - MARGIN_L - MARGIN_R

# ── Styles ──
def make_styles():
    s = {}
    s["body"] = ParagraphStyle(
        name="Body", fontName="NotoSerifSC", fontSize=10.5, leading=17,
        alignment=TA_JUSTIFY, textColor=TEXT_PRIMARY,
        firstLineIndent=0, spaceAfter=6,
    )
    s["body_lead"] = ParagraphStyle(
        name="BodyLead", parent=s["body"], fontSize=11.5, leading=19,
        textColor=TEXT_SECOND, spaceAfter=10,
    )
    s["h1"] = ParagraphStyle(
        name="H1", fontName="NotoSerifSC-Bold", fontSize=22, leading=28,
        textColor=TEXT_PRIMARY, spaceBefore=18, spaceAfter=12,
        keepWithNext=1,
    )
    s["h2"] = ParagraphStyle(
        name="H2", fontName="NotoSerifSC-Bold", fontSize=15, leading=21,
        textColor=AMBER_DARK, spaceBefore=14, spaceAfter=8,
        keepWithNext=1,
    )
    s["h3"] = ParagraphStyle(
        name="H3", fontName="NotoSerifSC-Bold", fontSize=12, leading=17,
        textColor=TEXT_PRIMARY, spaceBefore=10, spaceAfter=6,
        keepWithNext=1,
    )
    s["eyebrow"] = ParagraphStyle(
        name="Eyebrow", fontName="NotoSerifSC-Bold", fontSize=8.5, leading=12,
        textColor=AMBER, spaceAfter=4,
    )
    s["caption"] = ParagraphStyle(
        name="Caption", fontName="NotoSerifSC", fontSize=9, leading=12,
        textColor=TEXT_MUTED, alignment=TA_LEFT, spaceAfter=4, spaceBefore=2,
    )
    s["code"] = ParagraphStyle(
        name="Code", fontName="DejaVuSans", fontSize=8.5, leading=12,
        textColor=TEXT_PRIMARY, backColor=CARD_BG,
        leftIndent=10, rightIndent=10, spaceBefore=6, spaceAfter=10,
        borderColor=BORDER, borderWidth=0.5, borderPadding=8,
    )
    s["callout"] = ParagraphStyle(
        name="Callout", fontName="NotoSerifSC", fontSize=10, leading=15,
        textColor=TEXT_PRIMARY, backColor=AMBER_PALE,
        leftIndent=12, rightIndent=12, spaceBefore=8, spaceAfter=10,
        borderColor=AMBER, borderWidth=0, borderPadding=10,
    )
    s["toc_l0"] = ParagraphStyle(
        name="TOC0", fontName="NotoSerifSC-Bold", fontSize=11, leading=18,
        textColor=TEXT_PRIMARY, leftIndent=0, spaceBefore=6,
    )
    s["toc_l1"] = ParagraphStyle(
        name="TOC1", fontName="NotoSerifSC", fontSize=10, leading=15,
        textColor=TEXT_SECOND, leftIndent=18, spaceBefore=2,
    )
    s["table_cell"] = ParagraphStyle(
        name="TableCell", fontName="NotoSerifSC", fontSize=9, leading=13,
        textColor=TEXT_PRIMARY, alignment=TA_LEFT,
    )
    s["table_cell_bold"] = ParagraphStyle(
        name="TableCellBold", fontName="NotoSerifSC-Bold", fontSize=9, leading=13,
        textColor=TEXT_PRIMARY, alignment=TA_LEFT,
    )
    s["table_header"] = ParagraphStyle(
        name="TableHeader", fontName="NotoSerifSC-Bold", fontSize=9.5, leading=13,
        textColor=colors.white, alignment=TA_LEFT,
    )
    s["stat_num"] = ParagraphStyle(
        name="StatNum", fontName="NotoSerifSC-Bold", fontSize=22, leading=26,
        textColor=AMBER, alignment=TA_CENTER, spaceAfter=2,
    )
    s["stat_label"] = ParagraphStyle(
        name="StatLabel", fontName="NotoSerifSC", fontSize=8.5, leading=11,
        textColor=TEXT_MUTED, alignment=TA_CENTER,
    )
    return s

STYLES = make_styles()

# ── Heading helper with bookmark for TOC ──
def heading(text, level=0, chapter=None):
    style = STYLES["h1"] if level == 0 else STYLES["h2"] if level == 1 else STYLES["h3"]
    key = f"h_{hashlib.md5(text.encode()).hexdigest()[:8]}"
    display = text if chapter is None else f"{chapter}. {text}"
    p = Paragraph(f'<a name="{key}"/>{display}', style)
    p.bookmark_name = key
    p.bookmark_level = level
    p.bookmark_text = display
    p.bookmark_key = key
    return p

# ── TOC DocTemplate ──
class TocDocTemplate(SimpleDocTemplate):
    def afterFlowable(self, flowable):
        if hasattr(flowable, "bookmark_name"):
            level = getattr(flowable, "bookmark_level", 0)
            text = getattr(flowable, "bookmark_text", "")
            key = getattr(flowable, "bookmark_key", "")
            self.notify("TOCEntry", (level, text, self.page, key))

# ── Page decoration (header/footer) ──
def draw_page_decoration(canvas, doc):
    canvas.saveState()
    # Footer line
    canvas.setStrokeColor(BORDER)
    canvas.setLineWidth(0.5)
    canvas.line(MARGIN_L, 18 * mm, PAGE_W - MARGIN_R, 18 * mm)
    # Footer text
    canvas.setFont("NotoSerifSC", 8)
    canvas.setFillColor(TEXT_MUTED)
    canvas.drawString(MARGIN_L, 12 * mm, "Dedco · Architecture Technique & Produit")
    canvas.drawRightString(PAGE_W - MARGIN_R, 12 * mm, f"Page {doc.page}")
    # Top accent bar (subtle)
    canvas.setFillColor(AMBER)
    canvas.rect(0, PAGE_H - 4, PAGE_W, 4, fill=1, stroke=0)
    canvas.restoreState()

# ── Build helpers ──
def para(text, style="body"):
    return Paragraph(text, STYLES[style])

def callout(text, kind="amber"):
    bg = AMBER_PALE if kind == "amber" else FOREST_PALE if kind == "forest" else TERRACOTTA_PALE
    accent = AMBER if kind == "amber" else FOREST if kind == "forest" else TERRACOTTA
    style = ParagraphStyle(
        name="CalloutBox", parent=STYLES["callout"],
        backColor=bg, borderColor=accent,
    )
    # Wrap with left accent border via table
    p = Paragraph(text, style)
    t = Table([[p]], colWidths=[CONTENT_W - 4])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), bg),
        ("LINEBEFORE", (0, 0), (0, -1), 3, accent),
        ("LEFTPADDING", (0, 0), (-1, -1), 14),
        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    return t

def code_block(text):
    # escape HTML special chars
    safe = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    safe = safe.replace("\n", "<br/>")
    safe = safe.replace(" ", "&nbsp;")
    return Paragraph(safe, STYLES["code"])

def make_table(headers, rows, col_widths=None):
    """Build a styled table with header row + striped body."""
    if col_widths is None:
        col_widths = [CONTENT_W / len(headers)] * len(headers)
    data = [[Paragraph(h, STYLES["table_header"]) for h in headers]]
    for row in rows:
        data.append([Paragraph(str(c), STYLES["table_cell"]) for c in row])
    t = Table(data, colWidths=col_widths, repeatRows=1)
    style = [
        ("BACKGROUND", (0, 0), (-1, 0), TABLE_HEADER_COLOR),
        ("TEXTCOLOR", (0, 0), (-1, 0), TABLE_HEADER_TEXT),
        ("FONTNAME", (0, 0), (-1, 0), "NotoSerifSC-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 9.5),
        ("ALIGN", (0, 0), (-1, -1), "LEFT"),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ("LINEBELOW", (0, 0), (-1, 0), 1, AMBER),
        ("LINEBELOW", (0, -1), (-1, -1), 0.5, BORDER),
    ]
    # Stripes
    for i in range(1, len(data)):
        if i % 2 == 0:
            style.append(("BACKGROUND", (0, i), (-1, i), TABLE_ROW_ODD))
    t.setStyle(TableStyle(style))
    return t

def stat_row(stats):
    """3-4 column stat row."""
    cells = []
    for num, label in stats:
        cells.append([
            Paragraph(num, STYLES["stat_num"]),
            Paragraph(label, STYLES["stat_label"]),
        ])
    col_w = CONTENT_W / len(stats)
    t = Table([cells], colWidths=[col_w] * len(stats))
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("BACKGROUND", (0, 0), (-1, -1), CARD_BG),
        ("TOPPADDING", (0, 0), (-1, -1), 14),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 14),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("LINEBELOW", (0, 0), (-1, -1), 2, AMBER),
        ("BOX", (0, 0), (-1, -1), 0.5, BORDER),
    ]))
    return t

def hr():
    return HRFlowable(width="100%", thickness=0.5, color=BORDER, spaceBefore=8, spaceAfter=8)

# ── Story content ──
def build_story():
    story = []

    # ── TOC ──
    toc = TableOfContents()
    toc.levelStyles = [STYLES["toc_l0"], STYLES["toc_l1"]]
    story.append(Paragraph("Table des matières", STYLES["h1"]))
    story.append(Spacer(1, 8))
    story.append(HRFlowable(width="100%", thickness=2, color=AMBER, spaceBefore=0, spaceAfter=18))
    story.append(toc)
    story.append(PageBreak())

    # ════════════════════════════════════════
    # CH 1 — Vision & contexte
    # ════════════════════════════════════════
    story.append(heading("Vision & contexte", 0, 1))
    story.append(para(
        "<b>Dedco</b> est la marketplace béninoise de l'aménagement intérieur qui connecte "
        "directement les clients souhaitant meubler ou redécorer leur intérieur avec les "
        "designers et artisans locaux. La plateforme opère depuis Cotonou, Porto-Novo et "
        "Parakou, et met en valeur un savoir-faire typiquement béninois : bois iroko, rotin "
        "tressé, bogolan, wax. L'enjeu est double — d'une part offrir aux clients un accès "
        "direct à des créateurs vérifiés avec paiement sécurisé et livraison tracée, d'autre "
        "part fournir aux artisans et designers un canal de vente professionnel et un outil "
        "de gestion de leur activité.", "body"))

    story.append(para(
        "Le produit digital se décompose en quatre espaces distincts : un <b>site public</b> "
        "(marketplace, inspirations, fiches artisans/designers, magazine) accessible à tous "
        "les visiteurs ; un <b>espace client</b> pour le suivi des commandes, briefs et "
        "projets ; et trois <b>dashboards prestataires</b> (artisan, designer, maison déco) "
        "qui fonctionnent comme des back-offices spécialisés par métier. Un tableau de bord "
        "administrateur complète l'ensemble pour la modération et la gestion plateforme.", "body"))

    story.append(para(
        "Cette architecture multi-acteurs constitue le cœur du produit : chaque rôle dispose "
        "d'un parcours adapté à sa logique métier, et les transitions entre espaces sont "
        "strictement contrôlées pour éviter toute confusion. Les prestataires sont ainsi "
        "enfermés dans leur dashboard dédié, sans accès au site public, tandis que les "
        "clients naviguent librement sur la marketplace et accèdent à leurs pages de suivi.", "body"))

    story.append(Spacer(1, 14))
    story.append(stat_row([
        ("5", "Rôles utilisateurs"),
        ("60+", "Pages dynamiques"),
        ("154", "Fichiers TS/TSX"),
        ("43", "Commits (30 jours)"),
    ]))
    story.append(PageBreak())

    # ════════════════════════════════════════
    # CH 2 — Stack technique & infra
    # ════════════════════════════════════════
    story.append(heading("Stack technique & infrastructure", 0, 2))
    story.append(para(
        "Le projet repose sur une stack Next.js moderne, choisie pour son écosystème mature, "
        "son support TypeScript natif et son déploiement serverless sur Vercel. Le build "
        "utilise Turbopack pour des temps de compilation réduits, et le code splitting est "
        "poussé via 84 imports <code>dynamic()</code> pour les pages secondaires. Les pages "
        "critiques (Home, Marketplace, Product, Scene) sont chargées en eager pour optimiser "
        "le LCP.", "body"))

    story.append(Spacer(1, 8))
    story.append(make_table(
        ["Technologie", "Version", "Rôle"],
        [
            ["Next.js", "16.1.3 (Turbopack)", "Framework React, App Router, SSR"],
            ["TypeScript", "5.x", "Typage statique strict"],
            ["Tailwind CSS", "4.x", "Styling utility-first + tokens custom"],
            ["shadcn/ui + Radix UI", "Dernière", "Composants accessibles (Dialog, Drawer, etc.)"],
            ["Zustand", "5.x", "State management avec middleware persist"],
            ["Prisma ORM", "6.11", "Schema SQLite (User, Post — backend minimal)"],
            ["Framer Motion", "11.x", "Animations de page, transitions, micro-interactions"],
            ["Lucide Icons", "Dernière", "Iconographie cohérente"],
            ["Vercel", "Auto-deploy", "Hébergement serverless, preview par branche"],
        ],
        col_widths=[55*mm, 40*mm, CONTENT_W - 95*mm],
    ))

    story.append(Spacer(1, 12))
    story.append(heading("Déploiement & CI/CD", 2))
    story.append(para(
        "Le code source est hébergé sur GitHub à l'adresse <b>github.com/Golden-003/Dedco</b>. "
        "Chaque push sur la branche <code>main</code> déclenche un build Vercel automatique "
        "avec déploiement en production sur <b>dedco-h8zw.vercel.app</b>. Les branches "
        "secondaires bénéficient de preview URLs isolées. La pipeline inclut un lint ESLint "
        "et un type-check TypeScript, ainsi qu'un build de validation avant publication. "
        "Aucune base de données n'est actuellement active en production — l'application "
        "fonctionne en mode démo avec données mockées et persistance localStorage.", "body"))

    story.append(callout(
        "<b>État actuel :</b> 1 route API (<code>/api</code> hello-world). Le backend réel "
        "(auth, products, orders) a été retiré — l'app fonctionne en SPA pur avec données "
        "mockées. La migration vers un backend Prisma + API routes est planifiée en P1-4.",
        "amber"))
    story.append(PageBreak())

    # ════════════════════════════════════════
    # CH 3 — Architecture SPA & routing
    # ════════════════════════════════════════
    story.append(heading("Architecture SPA & routing interne", 0, 3))
    story.append(para(
        "Dedco utilise une architecture SPA mono-route : une seule route App Router "
        "(<code>/</code> dans <code>src/app/page.tsx</code>) sert l'ensemble de l'application. "
        "La navigation interne est gérée par un store Zustand qui maintient l'objet "
        "<code>route</code> courant (page + paramètres), et un switch dans "
        "<code>DedcoRouter</code> résout la page à afficher. Cette approche a été choisie "
        "pour sa simplicité de mise en œuvre et la fluidité des transitions (pas de rechargement, "
        "pas de layout shift), au prix d'une migration future vers de vraies routes App Router "
        "planifiée en P1-4.", "body"))

    story.append(heading("Type AppRoute — discriminated union", 2))
    story.append(para(
        "Toutes les routes possibles sont décrites par une union TypeScript dans "
        "<code>src/lib/store.ts</code>. Le typage garantit que chaque navigation passe les "
        "bons paramètres (id, briefId, projectId, proposalId, etc.).", "body"))
    story.append(code_block(
        "type AppRoute =\n"
        "  | { page: 'home' }\n"
        "  | { page: 'product'; id: number }\n"
        "  | { page: 'projet-artisan-detail'; projectId: string }\n"
        "  | { page: 'brief-designer'; designerId: number }\n"
        "  | { page: 'messages'; conversationId?: string }\n"
        "  | ... // 60+ variantes"
    ))

    story.append(heading("Code splitting", 2))
    story.append(para(
        "Les pages sont chargées selon deux stratégies : <b>eager</b> pour les pages critiques "
        "LCP (Home, Marketplace, Product, Scene, Inspirations, Designers) et <b>lazy</b> via "
        "<code>dynamic()</code> pour les 80+ pages secondaires. Cette répartition réduit le "
        "bundle initial de ~40% tout en gardant les pages clés instantanément disponibles. "
        "Les pages dashboard sont chargées en eager pour éviter tout flash lors de la "
        "navigation intra-dashboard.", "body"))

    story.append(heading("Bridge AppRoute ↔ Route legacy", 2))
    story.append(para(
        "Pour préserver la compatibilité avec les composants hérités qui utilisent l'ancien "
        "type <code>Route</code> (nom-based), deux fonctions bridge "
        "(<code>appRouteToRoute</code> et <code>routeToAppRoute</code>) assurent la "
        "conversion. Le <code>Navbar</code> et le <code>BottomNav</code> consomment encore "
        "ce type legacy.", "body"))
    story.append(PageBreak())

    # ════════════════════════════════════════
    # CH 4 — Design system
    # ════════════════════════════════════════
    story.append(heading("Design system Dedco", 0, 4))
    story.append(para(
        "L'identité visuelle de Dedco repose sur trois couleurs brand ancrées dans "
        "l'esthétique béninoise : l'<b>amber</b> (#BF793B) pour l'accent principal et les "
        "CTA, la <b>terracotta</b> (#A6442E) pour les états d'alerte et de validation "
        "urgente, et le <b>forest</b> (#548C45) pour les confirmations et les indicateurs "
        "positifs. Ces trois teintes sont déclinées en variantes pale pour les fonds et en "
        "variantes dark pour le texte accentué. Le fond crème (#FAF7F2) apporte chaleur et "
        "lisibilité, tandis que l'encre (#1E1813) sert de texte primaire.", "body"))

    story.append(Spacer(1, 8))
    story.append(make_table(
        ["Token", "Hex", "Usage"],
        [
            ["--amber", "#BF793B", "CTA, accents, liens, badges"],
            ["--amber-pale", "#FEF5E9", "Fonds hover, sélection"],
            ["--terracotta", "#A6442E", "Alertes, litiges, déconnexion"],
            ["--forest", "#548C45", "Succès, paiements, en ligne"],
            ["--bg-cream", "#FAF7F2", "Fond principal"],
            ["--bg-card", "#FFFFFF", "Cartes, surfaces"],
            ["--text-1", "#1E1813", "Texte primaire (encre)"],
            ["--text-3", "#7A7068", "Texte muted (WCAG AA)"],
        ],
        col_widths=[40*mm, 35*mm, CONTENT_W - 75*mm],
    ))

    story.append(Spacer(1, 12))
    story.append(heading("Typographie", 2))
    story.append(para(
        "Deux familles coexistent : <b>Quache</b> pour les titres et mots isolés (display), "
        "et <b>Plus Jakarta Sans</b> pour le corps de texte et les chiffres. Une astuce "
        "unicode-range exclut les chiffres (U+0030-0039) de Quache pour forcer le fallback "
        "vers Jakarta, dont les chiffres sont plus lisibles. Les 5 weights Quache sont "
        "embarqués en base64 dans <code>globals.css</code> pour éviter toute requête "
        "supplémentaire.", "body"))

    story.append(heading("Classes utilitaires custom", 2))
    story.append(para(
        "Une bibliothèque de classes <code>.dedco-*</code> centralise les patterns "
        "récurrents : <code>.dedco-btn</code>, <code>.dedco-btn-primary</code>, "
        "<code>.dedco-card</code>, <code>.dedco-badge-*</code>, <code>.dedco-fade-in</code>. "
        "Ces classes garantissent la cohérence visuelle et réduisent la duplication CSS. "
        "Un brand book PDF de 55 pages documente l'ensemble du système et a été livré "
        "séparément.", "body"))
    story.append(PageBreak())

    # ════════════════════════════════════════
    # CH 5 — Rôles & permissions
    # ════════════════════════════════════════
    story.append(heading("Rôles utilisateurs & permissions", 0, 5))
    story.append(para(
        "Cinq rôles coexistent dans Dedco, chacun avec un périmètre d'action strictement "
        "délimité. La règle d'or est la <b>séparation stricte</b> entre clients (qui "
        "consomment le site public) et prestataires (qui sont enfermés dans leur dashboard "
        "dédié). Cette séparation évite la confusion entre interfaces et garantit que chaque "
        "acteur voit l'application à travers le prisme de son métier.", "body"))

    story.append(Spacer(1, 8))
    story.append(make_table(
        ["Rôle", "Page d'accueil", "Accès site public", "Dashboard dédié"],
        [
            ["Client", "home (marketplace)", "Oui", "Non — navbar publique"],
            ["Artisan", "artisan-dashboard", "Non (verrouillé)", "Oui — sidebar artisan"],
            ["Designer", "designer-dashboard", "Non (verrouillé)", "Oui — sidebar designer"],
            ["Maison déco", "maison-dashboard", "Non (verrouillé)", "Oui — sidebar maison"],
            ["Admin", "admin-dashboard", "Oui", "Oui — sidebar admin"],
        ],
        col_widths=[28*mm, 38*mm, 38*mm, CONTENT_W - 104*mm],
    ))

    story.append(Spacer(1, 12))
    story.append(heading("ROLE_DASHBOARD — mapping rôle → page", 2))
    story.append(para(
        "Une table <code>ROLE_DASHBOARD</code> dans <code>layout.tsx</code> mappe chaque rôle "
        "vers sa page d'accueil dédiée. Le menu utilisateur (UserMenu) et le drawer mobile "
        "utilisent cette table pour router l'utilisateur connecté vers son espace. Le libellé "
        "et l'icône associés (<code>ROLE_LABEL</code>, <code>ROLE_ICON</code>) sont affichés "
        "dans le dropdown de profil et la sidebar du dashboard.", "body"))

    story.append(heading("Séparation prestataires / clients", 2))
    story.append(para(
        "La séparation est appliquée à deux niveaux. Au niveau du <b>shell</b> "
        "(<code>page.tsx</code>), la navbar publique, le bottom-nav et le footer sont "
        "masqués pour tout rôle prestataire — peu importe la page consultée. Au niveau du "
        "<b>route guarding</b> (<code>dedco-router.tsx</code>), toute tentative d'accès à "
        "une page publique par un prestataire déclenche une redirection silencieuse vers "
        "son dashboard. Cette double barrière garantit qu'aucun prestataire ne puisse "
        "naviguer sur la marketplace, inspirations ou autre page client.", "body"))

    story.append(callout(
        "<b>Règle métier :</b> les prestataires (artisan, designer, maison déco) n'ont accès "
        "qu'à leur dashboard. Le client navigue sur le site public et accède à ses pages de "
        "suivi. L'admin est le seul rôle hybride — il garde l'accès au site public ET à son "
        "tableau de bord d'administration.", "forest"))
    story.append(PageBreak())

    # ════════════════════════════════════════
    # CH 6 — Route guarding
    # ════════════════════════════════════════
    story.append(heading("Route guarding & redirection silencieuse", 0, 6))
    story.append(para(
        "Le route guarding de Dedco a été repensé pour <b>supprimer l'écran « Accès restreint »</b> "
        "(<code>GuardBlocked</code>) qui s'affichait auparavant quand un utilisateur tentait "
        "d'accéder à une page non autorisée. À la place, une redirection silencieuse est "
        "effectuée via <code>useEffect</code> + <code>navigate()</code>. Le temps de la "
        "redirection (1 frame), le composant rend <code>null</code> pour éviter tout flash "
        "de contenu non autorisé.", "body"))

    story.append(heading("Trois guards complémentaires", 2))
    story.append(make_table(
        ["Guard", "Condition", "Action"],
        [
            ["requiredRole", "Page dans ARTISAN_PAGES / DESIGNER_PAGES / ADMIN_PAGES / maison-dashboard", "Redirige si rôle ≠ requis"],
            ["needsAuth", "Page dans AUTH_REQUIRED_PAGES (18 pages)", "Redirige vers login si non connecté"],
            ["isLockedOut", "Rôle prestataire + page publique", "Redirige vers dashboard du rôle"],
        ],
        col_widths=[35*mm, 75*mm, CONTENT_W - 110*mm],
    ))

    story.append(Spacer(1, 10))
    story.append(heading("ROLE_HOME_PAGE — redirection par défaut", 2))
    story.append(code_block(
        "const ROLE_HOME_PAGE: Record<UserRole, AppRoute['page']> = {\n"
        "  client: 'home',\n"
        "  artisan: 'artisan-dashboard',\n"
        "  designer: 'designer-dashboard',\n"
        "  admin: 'admin-dashboard',\n"
        "  maison: 'maison-dashboard',\n"
        "};"
    ))

    story.append(heading("Pages partagées — accessibles multi-rôles", 2))
    story.append(para(
        "Certaines pages de détail sont <b>partagées</b> entre client et prestataire : "
        "<code>projet-artisan-detail</code>, <code>projet-designer-detail</code>, "
        "<code>brief-artisan-detail</code>, <code>brief-designer-detail</code>. Elles ont "
        "été retirées des sets <code>ARTISAN_PAGES</code> / <code>DESIGNER_PAGES</code> et "
        "ajoutées à <code>AUTH_REQUIRED_PAGES</code>, ce qui les rend accessibles à tout "
        "utilisateur connecté quel que soit son rôle. L'affichage est ensuite adapté au "
        "rôle via un flag <code>isDesigner</code> / <code>isArtisan</code>.", "body"))

    story.append(callout(
        "<b>Bug historique corrigé :</b> ces pages étaient initialement dans les sets "
        "rôle-spécifiques. Quand un client cliquait « Voir le projet » dans Mes Projets, "
        "le guard voyait <code>requiredRole = 'artisan'</code> mais <code>currentUser.role = "
        "'client'</code> → il redirigeait silencieusement vers home, donnant l'impression "
        "que rien n'était cliquable.", "terracotta"))
    story.append(PageBreak())

    # ════════════════════════════════════════
    # CH 7 — Stores Zustand
    # ════════════════════════════════════════
    story.append(heading("Stores Zustand — état global", 0, 7))
    story.append(para(
        "Quatre stores Zustand gèrent l'état global de l'application. Le store principal "
        "<code>useDedcoStore</code> centralise la navigation, l'authentification, le panier, "
        "les favoris et les scènes sauvegardées. Les trois autres stores sont spécialisés "
        "par domaine métier : briefs artisan, briefs designer, notifications. Tous "
        "persistent dans localStorage via le middleware <code>persist</code> de Zustand, "
        "ce qui permet à l'utilisateur de retrouver son état après un rafraîchissement.", "body"))

    story.append(Spacer(1, 8))
    story.append(make_table(
        ["Store", "Fichier", "Lignes", "Persisté", "Contenu"],
        [
            ["useDedcoStore", "lib/store.ts", "287", "Oui (cart, favorites, currentUser)", "Route, history, cart, favorites, currentUser, navigate, goBack"],
            ["useBriefArtisanStore", "lib/artisan-brief-store.ts", "427", "Oui", "Briefs artisan, proposals, transitions, actions"],
            ["useBriefDesignerStore", "lib/designer-brief-store.ts", "327", "Oui", "Briefs designer, prestations, paiements"],
            ["useNotificationStore", "lib/notification-store.ts", "209", "Oui", "Notifications par rôle, unreadCount, markAsRead"],
        ],
        col_widths=[42*mm, 42*mm, 15*mm, 35*mm, CONTENT_W - 134*mm],
    ))

    story.append(Spacer(1, 12))
    story.append(heading("Persistance sélective", 2))
    story.append(para(
        "Le store principal utilise <code>partialize</code> pour ne persister que les "
        "données utilisateur durables (cart, favorites, savedScenes, currentUser) — pas "
        "l'état UI éphémère (cartOpen, searchOpen, route). Cette stratégie évite les bugs "
        "de reprise où l'utilisateur se retrouve sur une page inattendue après un "
        "rafraîchissement. Les stores métier persistent intégralement leurs données pour "
        "préserver l'état des briefs en cours de rédaction.", "body"))

    story.append(heading("Navigation programmatique", 2))
    story.append(para(
        "La navigation s'effectue via <code>navigate(route)</code> qui empile la route "
        "courante dans <code>history</code> avant de la remplacer. <code>goBack()</code> "
        "dépile la dernière entrée et y revient, ou redirige vers home si l'historique est "
        "vide. Ce mécanisme est utilisé par les boutons « Retour » des pages de détail.", "body"))
    story.append(PageBreak())

    # ════════════════════════════════════════
    # CH 8 — Shell & layouts dashboard
    # ════════════════════════════════════════
    story.append(heading("Shell & layouts dashboard", 0, 8))
    story.append(para(
        "Le shell de l'application alterne entre deux modes : <b>navbar publique</b> (pour "
        "les visiteurs et clients) et <b>sidebar dashboard</b> (pour les prestataires et "
        "admin connectés). La décision est prise dans <code>page.tsx</code> via le flag "
        "<code>isWrappedInDashboard</code>, qui masque alors la Navbar, le BottomNav et le "
        "Footer publics.", "body"))

    story.append(heading("DashboardSidebar — mémoïsée et stable", 2))
    story.append(para(
        "Le composant <code>DashboardSidebar</code> est encapsulé dans <code>memo()</code> "
        "pour éviter tout re-render inutile. Il reçoit <code>currentPage</code> et "
        "<code>children</code> en props — pas de souscription au store. Les 4 layouts "
        "(Artisan, Designer, Admin, Maison) ne souscrivent plus non plus au store : ils "
        "reçoivent <code>currentPage</code> du routeur parent. Cette architecture garantit "
        "que la sidebar ne soit jamais démontée entre deux pages d'un même dashboard — seul "
        "l'état actif des boutons change.", "body"))

    story.append(heading("Layout h-screen + overflow-hidden", 2))
    story.append(para(
        "Le conteneur racine du dashboard utilise <code>flex h-screen overflow-hidden</code> "
        "plutôt que <code>min-h-screen</code>. Cette différence est cruciale : en mode "
        "h-screen, la sidebar est fixe (sticky implicite) et seul le contenu principal "
        "défile via <code>overflow-y-auto</code>. Les pages plein écran comme la messagerie "
        "peuvent alors gérer leur propre scroll interne sans impacter la sidebar ni le "
        "header mobile. Le header mobile a une hauteur fixe de <code>h-16</code> (64px) pour "
        "permettre aux pages de calculer leur hauteur exacte.", "body"))

    story.append(heading("allowExitToSite — verrou prestataire", 2))
    story.append(para(
        "Une prop <code>allowExitToSite</code> contrôle l'affichage du bouton « Retour au "
        "site » dans la sidebar et la cliquabilité du logo. Pour les layouts Artisan, "
        "Designer et Maison, cette prop est à <code>false</code> — pas de bouton, logo "
        "non cliquable. Seul l'Admin garde <code>allowExitToSite=true</code> pour basculer "
        "entre son dashboard et le site public.", "body"))

    story.append(heading("sharedPages — pages wrappées selon rôle", 2))
    story.append(para(
        "Les pages <code>messages</code> et <code>notifications</code> sont partagées entre "
        "tous les rôles. Quand un prestataire y accède, elles sont wrappées dans son layout "
        "dashboard (sidebar conservée). Quand un client y accède, elles s'affichent en mode "
        "page publique (navbar visible). Cette logique est implémentée dans le routeur via "
        "<code>sharedPages</code> + <code>isPrestataireRole</code>.", "body"))
    story.append(PageBreak())

    # ════════════════════════════════════════
    # CH 9 — Moteur brief-artisan
    # ════════════════════════════════════════
    story.append(heading("Moteur métier brief-artisan", 0, 9))
    story.append(para(
        "Le module <code>src/lib/brief-artisan/</code> est le cœur métier de Dedco pour les "
        "briefs de fabrication artisanale. Il implémente une machine d'états complète sur "
        "8 fichiers et ~1500 lignes de code typé. Le module est conçu pour être testable, "
        "prévisible et extensible — chaque transition est validée par des fonctions de "
        "permission, et chaque changement d'état déclenche des notifications automatiques.", "body"))

    story.append(Spacer(1, 8))
    story.append(make_table(
        ["Fichier", "Lignes", "Rôle"],
        [
            ["types.ts", "184", "Types BriefArtisanStatus, BriefArtisan, ArtisanBriefProposal, transitions"],
            ["statuses.ts", "133", "Config des 11 statuts (label, color, badge, isUrgent)"],
            ["transitions.ts", "242", "23 transitions autorisées + helpers isValidTransition"],
            ["permissions.ts", "79", "13 fonctions canPublish, canSubmit, canPayDeposit, canCancel..."],
            ["engine.ts", "196", "applyTransition, orchestration état + notifications"],
            ["helpers.ts", "148", "formatBriefDate, getProgress, getNextAction, sortBriefs"],
            ["notifications.ts", "133", "Génération de notifications par transition"],
            ["mock.ts", "313", "Données mockées pour démo (5 briefs, 8 proposals)"],
            ["index.ts", "88", "Barrel export"],
        ],
        col_widths=[42*mm, 18*mm, CONTENT_W - 60*mm],
    ))

    story.append(Spacer(1, 12))
    story.append(heading("11 statuts de brief artisan", 2))
    story.append(para(
        "Le cycle de vie d'un brief artisan traverse 11 statuts, du brouillon initial "
        "jusqu'à la livraison finale et la clôture. Chaque statut a une configuration "
        "visuelle (couleur, badge, libellé) et détermine les actions disponibles pour "
        "chaque acteur (client, artisan, admin).", "body"))

    story.append(make_table(
        ["Statut", "Libellé", "Étape"],
        [
            ["DRAFT", "Brouillon", "Client rédige"],
            ["SUBMITTED", "Soumis", "En attente modération"],
            ["PUBLISHED", "Publié", "Visible par artisans, expiration 7j"],
            ["AWAITING_DEPOSIT", "Acompte requis", "Artisan sélectionné, paiement 30%"],
            ["IN_PROGRESS", "En fabrication", "Acompte payé, artisan travaille"],
            ["DELIVERED", "Livré", "Artisan a livré, validation client"],
            ["COMPLETED", "Terminé", "Client a validé, paiement libéré"],
            ["CANCELLED", "Annulé", "Annulation client/admin"],
            ["EXPIRED", "Expiré", "Délai 7j dépassé sans proposition"],
            ["REJECTED", "Rejeté", "Modération refusée"],
            ["CHANGE_REQUEST_PENDING", "Modif. en attente", "Artisan demande modif client"],
        ],
        col_widths=[55*mm, 35*mm, CONTENT_W - 90*mm],
    ))
    story.append(PageBreak())

    # ════════════════════════════════════════
    # CH 10 — Workflows métier
    # ════════════════════════════════════════
    story.append(heading("Workflows métier", 0, 10))
    story.append(para(
        "Dedco orchestre trois workflows principaux : le brief artisan (fabrication "
        "sur-mesure), le brief designer (prestation de design d'intérieur) et la commande "
        "catalogue (produit existant). Chaque workflow a son propre cycle de vie, ses "
        "propres paiements et ses propres pages de suivi. Les workflows se rejoignent sur "
        "la page unifiée « Mes projets » qui regroupe tous les éléments en cours pour le "
        "client.", "body"))

    story.append(heading("Brief artisan — cycle complet", 2))
    story.append(para(
        "Le client crée un brief décrivant la pièce à meubler, les matériaux souhaités, le "
        "budget et les délais. Le brief est modéré, puis publié aux artisans qualifiés qui "
        "soumettent des propositions (devis + délai + approche). Le client sélectionne une "
        "proposition, paie un acompte de 30% (escrow), l'artisan fabrique, livre, et le "
        "client valide pour libérer le solde. À chaque étape, des notifications sont "
        "envoyées aux acteurs concernés, et des actions prioritaires sont mises en avant "
        "dans le dashboard client via <code>ACTION_PRIORITY_ORDER</code>.", "body"))

    story.append(heading("Brief designer — prestation de service", 2))
    story.append(para(
        "Le brief designer suit un flux similaire mais adapté au service intellectuel : le "
        "client décrit son besoin (pièce, style, budget), un designer répond avec une "
        "proposition de mission (scope, honoraires, livrables). Après acceptation et paiement "
        "100% (escrow), le designer produit ses livrables (moodboard, plan 2D/3D, sélection "
        "de sourcing). Le client peut demander jusqu'à 2 révisions incluses, puis valide la "
        "livraison pour libérer le paiement au designer.", "body"))

    story.append(heading("Paiement escrow & garantie 1.5%", 2))
    story.append(para(
        "Tous les paiements transitent par un système d'<b>escrow</b> : le client paie 100% "
        "à la commande (ou 30% acompte + 70% à la livraison pour les briefs artisan), et "
        "Dedco retient les fonds jusqu'à validation de livraison. Une commission de 10% est "
        "prélevée au prestataire. Pour les projets artisan, un fonds de garantie de 1.5% "
        "est ajouté au paiement pour couvrir les litiges éventuels. Le paiement s'effectue "
        "via Mobile Money (MTN, Moov), les deux opérateurs dominants au Bénin.", "body"))

    story.append(heading("Page Mes Projets — vue unifiée client", 2))
    story.append(para(
        "La page <code>mes-projets-page.tsx</code> regroupe tous les éléments en cours pour "
        "le client : briefs artisan avec propositions, projets en fabrication, prestations "
        "designer, paiements en attente, projets terminés et réclamations. Chaque carte "
        "affiche une priorité d'action (PAYMENT_REQUIRED, CHANGE_REQUEST_PENDING, "
        "DELIVERY_CONFIRMATION_REQUIRED, etc.) avec deadline et conséquence. Le tri "
        "automatique place les actions urgentes en haut via "
        "<code>ACTION_PRIORITY_ORDER</code>.", "body"))
    story.append(PageBreak())

    # ════════════════════════════════════════
    # CH 11 — Pages partagées role-aware
    # ════════════════════════════════════════
    story.append(heading("Pages partagées — affichage role-aware", 0, 11))
    story.append(para(
        "Quatre pages de détail sont partagées entre client et prestataire. Elles utilisent "
        "le flag <code>isDesigner</code> / <code>isArtisan</code> pour adapter l'affichage "
        "au rôle de l'utilisateur connecté. Le prestataire voit le projet comme un "
        "<b>gestionnaire</b> (gérer ses livrables, traiter les révisions, attendre "
        "validation), tandis que le client voit le projet comme un <b>spectateur actif</b> "
        "(valider la livraison, demander des révisions).", "body"))

    story.append(Spacer(1, 8))
    story.append(make_table(
        ["Page", "Vue designer", "Vue client"],
        [
            ["projet-designer-detail", "Mes livrables + Ajouter", "Livrables du designer + Valider"],
            ["projet-designer-detail (révisions)", "Révisions à traiter + Marquer livrée", "Demander une révision"],
            ["projet-designer-detail (messages)", "Client en interlocuteur", "Designer en interlocuteur"],
            ["projet-artisan-detail", "Suivi fabrication", "Suivi commande"],
            ["brief-artisan-detail", "Voir le brief reçu", "Voir mon brief + propositions"],
            ["brief-designer-detail", "Voir la demande reçue", "Voir ma demande"],
        ],
        col_widths=[50*mm, 55*mm, CONTENT_W - 105*mm],
    ))

    story.append(Spacer(1, 12))
    story.append(heading("Helper getBackToProjets — boutons retour role-aware", 2))
    story.append(para(
        "Un helper centralisé <code>src/lib/back-to-projets.ts</code> mappe le rôle vers "
        "la route et le label du bouton retour. Il est utilisé par 12 boutons répartis sur "
        "6 fichiers (projet-artisan-detail, projet-designer-detail, brief-artisan-detail, "
        "brief-designer-detail, projet-paiement-artisan, designer-workflow-pages).", "body"))

    story.append(code_block(
        "export function getBackToProjets(role): { route, label } {\n"
        "  switch (role) {\n"
        "    case 'artisan':  return { route: {page:'artisan-projets'}, label:'Projets en cours' };\n"
        "    case 'designer': return { route: {page:'designer-projects'}, label:'Projets en cours' };\n"
        "    case 'maison':   return { route: {page:'maison-dashboard'}, label:'Mon espace' };\n"
        "    case 'admin':    return { route: {page:'admin-dashboard'}, label:'Mon espace' };\n"
        "    default:         return { route: {page:'client-projets'}, label:'Mes projets' };\n"
        "  }\n"
        "}"
    ))

    story.append(heading("Carte partenaire — inversée selon rôle", 2))
    story.append(para(
        "Sur la page projet-designer-detail, la carte partenaire affiche le <b>client</b> "
        "quand l'utilisateur est designer (« Votre client »), et le <b>designer</b> quand "
        "l'utilisateur est client. L'avatar, le nom et le libellé s'adaptent. Cette "
        "inversion est essentielle pour que chaque acteur voie l'autre partie comme son "
        "interlocuteur, et non comme lui-même.", "body"))
    story.append(PageBreak())

    # ════════════════════════════════════════
    # CH 12 — Messagerie & notifications
    # ════════════════════════════════════════
    story.append(heading("Messagerie & notifications", 0, 12))
    story.append(para(
        "La messagerie Dedco est intégrée au dashboard pour les prestataires (sidebar) et "
        "accessible aux clients via le menu utilisateur. Elle utilise un layout 2 colonnes "
        "(liste des conversations + vue chat) qui s'adapte au mobile (un seul panneau à la "
        "fois). La hauteur est calculée via <code>h-full</code> dans un parent "
        "<code>h-screen + overflow-hidden</code>, ce qui permet au chat de gérer son propre "
        "scroll sans impacter la sidebar.", "body"))

    story.append(heading("Bannière de sécurité — « Échange protégé par Dedco »", 2))
    story.append(para(
        "Une bannière forest-pale est affichée en bas de chaque conversation. Le texte a été "
        "renforcé pour être explicatif : « Réglez uniquement via le bouton Payer de Dedco. "
        "Ne partagez jamais de numéro Mobile Money, RIB ou lien de paiement externe dans "
        "cette conversation. En cas de doute, signalez le message à notre équipe. » "
        "L'icône <code>ShieldCheck</code> (positive) remplace l'ancienne <code>ShieldAlert</code> "
        "(anxiogène).", "body"))

    story.append(heading("NotificationStore — notifications par rôle", 2))
    story.append(para(
        "Le store <code>useNotificationStore</code> maintient une liste de notifications "
        "typées (brief_artisan, brief_designer, project, message, payment, delivery, review, "
        "system, litige). Chaque type a une configuration visuelle (icône, couleur, fond). "
        "À la connexion, <code>initForRole(role)</code> peuple le store avec des "
        "notifications mockées adaptées au rôle de l'utilisateur — un artisan voit des "
        "notifications de briefs reçus, un client voit des notifications de paiements et "
        "livraisons. Le badge <code>unreadCount</code> alimente la cloche "
        "<code>NotificationBell</code> dans la navbar et les sidebars.", "body"))

    story.append(heading("Marquer comme lu + Tout lire", 2))
    story.append(para(
        "Les notifications peuvent être marquées individuellement comme lues (clic → "
        "<code>markAsRead(id)</code>), ou toutes en une fois (<code>markAllAsRead()</code>). "
        "La page notifications affiche les éléments groupés par date (Aujourd'hui, Hier, "
        "Cette semaine, Plus ancien) avec un filtre Tout / Non lus. Le clic sur une "
        "notification déclenche <code>markAsRead</code> puis navigue vers la page "
        "associée (brief, projet, commande...).", "body"))
    story.append(PageBreak())

    # ════════════════════════════════════════
    # CH 13 — Arborescence des fichiers
    # ════════════════════════════════════════
    story.append(heading("Arborescence des fichiers", 0, 13))
    story.append(para(
        "Le projet compte 154 fichiers TypeScript/TSX organisés selon une architecture en "
        "couches : couche app (routes), couche components (UI), couche lib (logique). "
        "Voici la structure synthétique avec les répertoires clés.", "body"))

    story.append(code_block(
        "src/\n"
        "├── app/\n"
        "│   ├── api/              # Route API hello-world (1 fichier)\n"
        "│   ├── layout.tsx        # Layout racine (fonts, metadata)\n"
        "│   ├── page.tsx          # Page racine SPA (shell + DedcoRouter)\n"
        "│   ├── loading.tsx       # Suspense fallback\n"
        "│   ├── error.tsx         # Error boundary\n"
        "│   └── not-found.tsx     # 404\n"
        "│\n"
        "├── components/\n"
        "│   ├── dedco/\n"
        "│   │   ├── layout.tsx         # Navbar, BottomNav, Footer, UserMenu, NotificationBell\n"
        "│   │   ├── dedco-router.tsx   # Routing SPA + guards + role-aware shell\n"
        "│   │   ├── home-page.tsx      # Landing publique\n"
        "│   │   ├── marketplace-page.tsx\n"
        "│   │   ├── product-page.tsx\n"
        "│   │   ├── cards.tsx          # ProductCard, ArtisanCard, DesignerCard\n"
        "│   │   ├── cart-search.tsx    # CartSidebar + SearchOverlay (Radix Dialog)\n"
        "│   │   ├── welcome-popup.tsx  # Modal bienvenue + cookie banner\n"
        "│   │   └── pages/\n"
        "│   │       ├── (40 pages publiques + auth + client)\n"
        "│   │       ├── artisan/       # 8 pages dashboard artisan\n"
        "│   │       ├── designer/      # 8 pages dashboard designer\n"
        "│   │       ├── admin/         # 8 pages dashboard admin\n"
        "│   │       ├── shared-sidebar.tsx  # DashboardSidebar memoïsée\n"
        "│   │       └── maison-dashboard.tsx\n"
        "│   ├── ui/                   # shadcn/ui (40 composants)\n"
        "│   └── theme-provider.tsx    # Dark mode (désactivé)\n"
        "│\n"
        "├── lib/\n"
        "│   ├── store.ts              # useDedcoStore (287 lignes, persist)\n"
        "│   ├── artisan-brief-store.ts\n"
        "│   ├── designer-brief-store.ts\n"
        "│   ├── notification-store.ts\n"
        "│   ├── brief-artisan/        # Moteur métier (8 fichiers, 1516 lignes)\n"
        "│   ├── types/                # Types métier (mes-projets, brief-artisan, etc.)\n"
        "│   ├── mock/                 # Données mockées\n"
        "│   ├── dedco-data.ts         # Catalogue produits/artisans/designers\n"
        "│   ├── dedco-status.tsx      # Config statuts briefs + projets\n"
        "│   ├── back-to-projets.ts    # Helper role-aware boutons retour\n"
        "│   └── utils.ts              # Helpers communs\n"
        "│\n"
        "└── hooks/\n"
        "    ├── use-mobile.ts\n"
        "    └── use-toast.ts"
    ))
    story.append(PageBreak())

    # ════════════════════════════════════════
    # CH 14 — Audit & corrections récentes
    # ════════════════════════════════════════
    story.append(heading("Audit & corrections récentes", 0, 14))
    story.append(para(
        "Le projet a fait l'objet de plusieurs vagues d'audit et de corrections. Voici la "
        "synthèse des 21+ corrections majeures appliquées, organisées par sévérité (P0 "
        "bloquant, P1 parcours, P2 UX, P3 polish). L'ensemble de ces corrections a été "
        "poussé sur GitHub et déployé sur Vercel en continu.", "body"))

    story.append(Spacer(1, 8))
    story.append(make_table(
        ["Catégorie", "Corrections clés"],
        [
            ["P0 — Bloquants (6)", "Persistance Zustand, route guarding par rôle, workflow brief fermé, modales Radix, contraste WCAG --text-3, error/loading/not-found"],
            ["P0 — Cohérence rôles (6)", "Bug isArtisan InvoicePage, retour OrderTracking selon rôle, déconnexion drawer, avatar mobile, bouton Voir le projet designer, boutons Marquer expédié + Voir détails artisan"],
            ["P1 — Parcours (5)", "MaisonLayout, NotificationBell mobile, profile mobile déconnexion, settings logout, notifications actions mobile"],
            ["P2 — UX (10+)", "Import mort order-tracking, profile dynamique, mes-projets designerId dynamique, boutons morts corrigés, dashboard boutons cliquables, designer-dashboard dynamique, badges hardcoded retirés, settings dynamique, messages filtrés, profile tab routing"],
            ["Refonte sidebar stable", "DashboardSidebar memoïsée, layouts sans subscribe au store, allowExitToSite, h-screen+overflow-hidden, sharedPages pour messages/notifications"],
            ["Séparation rôles stricte", "Prestataires enfermés dashboard, redirection silencieuse (plus GuardBlocked), isPrestataireLocked, isPublicPage, ROLE_HOME_PAGE"],
            ["Pages partagées role-aware", "projet-*-detail et brief-*-detail retirés des sets rôle-spécifiques, helper getBackToProjets, carte partenaire inversée"],
            ["Refonte messagerie", "Layout 2 colonnes dans dashboard, h-full, marquer comme lu, bannière sécurité explicative, état vide refait"],
            ["Kanban designer", "DesignerProjectsPage en kanban (En cours / En revue / Terminés), cartes compactes avec milestone"],
            ["Audit mobile complet", "33 corrections padding p-6 → p-4 sm:p-6, overflow protection, min-w-0 sur flex, break-words sur montants FCFA"],
        ],
        col_widths=[50*mm, CONTENT_W - 50*mm],
    ))
    story.append(PageBreak())

    # ════════════════════════════════════════
    # CH 15 — Roadmap & chantiers ouverts
    # ════════════════════════════════════════
    story.append(heading("Roadmap & chantiers ouverts", 0, 15))
    story.append(para(
        "Plusieurs chantiers restent ouverts pour faire passer Dedco d'un prototype "
        "fonctionnel à une plateforme production-ready. Voici les priorisations actuelles, "
        "classées par impact et complexité.", "body"))

    story.append(heading("P1-4 — Migration vraies routes App Router", 2))
    story.append(para(
        "L'architecture SPA mono-route actuelle simplifie le développement mais limite "
        "le SEO, le partage d'URL et le server-side rendering. La migration vers de vraies "
        "routes App Router (<code>/marketplace</code>, <code>/product/[id]</code>, "
        "<code>/artisan/[id]</code>, <code>/dashboard/artisan</code>, etc.) permettrait "
        "le deep-linking, le prerendering des pages publiques, et la séparation propre "
        "entre layouts public et dashboard. C'est un gros chantier qui impacte 60+ pages "
        "et tous les appels <code>navigate()</code>.", "body"))

    story.append(heading("P1-6 — Consolidation modules data", 2))
    story.append(para(
        "Les données mockées sont actuellement réparties sur plusieurs fichiers "
        "(<code>dedco-data.ts</code>, <code>dedco-data-expanded.ts</code>, "
        "<code>mock/mes-projets-data.ts</code>, <code>artisan-brief-mocks.ts</code>, etc.) "
        "avec des IDs qui se chevauchent. Une consolidation en un seul module typé "
        "faciliterait la maintenance et la future migration vers une API réelle.", "body"))

    story.append(heading("P3 — next/image sur 36 raw &lt;img&gt;", 2))
    story.append(para(
        "36 balises <code>&lt;img&gt;</code> natives subsistent dans le code au lieu de "
        "<code>next/image</code>. La migration permettrait l'optimisation automatique "
        "(WebP, lazy loading, responsive srcset) et réduirait le poids des pages de 30 à 50%.", "body"))

    story.append(heading("Backend réel — Prisma + API routes", 2))
    story.append(para(
        "L'application fonctionne actuellement en mode démo avec données mockées et "
        "persistance localStorage. La mise en place d'un backend réel (Prisma + PostgreSQL "
        "+ API routes Next.js) est nécessaire pour la production : authentification, "
        "persistance multi-appareils, gestion réelle des commandes et paiements Mobile Money. "
        "Le schema Prisma actuel (User, Post) est minimal et devra être étendu pour couvrir "
        "tout le modèle métier (Artisan, Designer, Product, Brief, Project, Order, Payment, "
        "Notification, Message, Review, Litige).", "body"))

    story.append(heading("Tests & CI", 2))
    story.append(para(
        "Aucun test automatisé n'est en place. L'ajout de tests unitaires sur le moteur "
        "brief-artisan (transitions, permissions) et de tests E2E sur les parcours critiques "
        "(commande, brief, paiement) garantirait la non-régression lors des évolutions.", "body"))
    story.append(PageBreak())

    # ════════════════════════════════════════
    # CH 16 — Conclusion
    # ════════════════════════════════════════
    story.append(heading("Conclusion", 0, 16))
    story.append(para(
        "Dedco est aujourd'hui une application SPA fonctionnelle et robuste, qui démontre "
        "la faisabilité technique d'une marketplace multi-acteurs spécialisée sur "
        "l'aménagement intérieur béninois. L'architecture en couches (shell, router, "
        "stores, layouts, pages) offre une séparation claire des responsabilités et "
        "facilite l'évolution. Le moteur métier brief-artisan, avec sa machine d'états "
        "complète et ses 13 fonctions de permission, constitue le cœur intellectual du "
        "produit et peut être réutilisé comme socle pour les workflows designer et maison "
        "déco.", "body"))

    story.append(para(
        "La séparation stricte entre prestataires et clients, appliquée à la fois au niveau "
        "du shell et du route guarding, garantit une expérience claire : chaque acteur voit "
        "l'application à travers le prisme de son métier, sans confusion possible. Les "
        "pages partagées role-aware (projet-detail, brief-detail) démontrent qu'une même "
        "page peut s'adapter au contexte de l'utilisateur sans duplication de code.", "body"))

    story.append(para(
        "Les prochaines itérations devront se concentrer sur la mise en production : "
        "migration vers de vraies routes App Router pour le SEO, backend réel avec Prisma "
        "et PostgreSQL, intégration Mobile Money, et tests automatisés. Le socle actuel — "
        "design system cohérent, stores typés, moteur métier validé — fournit une base "
        "solide pour ces évolutions. L'engagement qualité (audit mobile, refonte sidebar "
        "stable, séparation rôles) montre que la dette technique est gérée activement "
        "plutôt qu'accumulée.", "body"))

    return story

# ── Build body PDF ──
def build_body_pdf(output_path):
    doc = TocDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=MARGIN_L, rightMargin=MARGIN_R,
        topMargin=MARGIN_T, bottomMargin=MARGIN_B,
        title="Dedco — Architecture Technique & Produit",
        author="Z.ai",
        subject="Document d'architecture de la marketplace Dedco",
        creator="Z.ai",
    )
    story = build_story()
    doc.multiBuild(story, onFirstPage=draw_page_decoration, onLaterPages=draw_page_decoration)
    print(f"✓ Body PDF: {output_path}")

# ── Cover HTML ──
COVER_HTML = """<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet">
<style>
  @page { size: 794px 1123px; margin: 0; }
  html, body { margin: 0; padding: 0; background: #FAF7F2; font-family: 'Inter', sans-serif; }
  .cover { position: relative; width: 794px; height: 1123px; overflow: hidden; background: #FAF7F2; }
  .layer-1 { position: absolute; inset: 0; overflow: hidden; z-index: 1; }
  .grid-bg {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(to right, rgba(30,24,19,0.04) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(30,24,19,0.04) 1px, transparent 1px);
    background-size: 50px 50px;
  }
  .layer-2 { position: absolute; inset: 0; z-index: 2; }
  .anchor-line {
    position: absolute;
    left: 95px;
    top: 112px;
    bottom: 112px;
    width: 6px;
    background: #BF793B;
  }
  .layer-3 { position: absolute; inset: 0; z-index: 3; }
  .content {
    position: absolute;
    left: 131px;
    right: 95px;
    top: 0;
    bottom: 0;
  }
  .kicker {
    position: absolute;
    top: 168px;
    left: 0;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 3px;
    color: #BF793B;
    text-transform: uppercase;
    opacity: 0.85;
  }
  .title {
    position: absolute;
    top: 335px;
    left: 0;
    right: 0;
    font-family: 'Playfair Display', serif;
    font-size: 64px;
    font-weight: 900;
    line-height: 1.05;
    color: #1E1813;
    letter-spacing: -0.02em;
  }
  .title .dot { color: #BF793B; }
  .summary {
    position: absolute;
    top: 540px;
    left: 0;
    right: 95px;
    font-size: 14px;
    line-height: 1.65;
    color: #5B5048;
    max-width: 480px;
    opacity: 0.95;
  }
  .meta {
    position: absolute;
    top: 870px;
    left: 0;
    font-size: 13px;
    line-height: 1.6;
    color: #7A7068;
  }
  .meta strong { color: #1E1813; font-weight: 600; }
  .meta .sep { color: #BF793B; margin: 0 8px; }
  .footer {
    position: absolute;
    bottom: 60px;
    left: 131px;
    right: 95px;
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #7A7068;
    opacity: 0.7;
  }
  .accent-block {
    position: absolute;
    bottom: 130px;
    right: 95px;
    width: 4px;
    height: 80px;
    background: #A6442E;
  }
</style>
</head>
<body>
<div class="cover">
  <div class="layer-1">
    <div class="grid-bg"></div>
  </div>
  <div class="layer-2">
    <div class="anchor-line"></div>
    <div class="accent-block"></div>
  </div>
  <div class="layer-3">
    <div class="content">
      <div class="kicker">Architecture Technique &amp; Produit · Juillet 2026</div>
      <div class="title">Dedco<span class="dot">.</span><br>Marketplace<br>béninoise</div>
      <div class="summary">
        Document de référence sur l'architecture technique et produit de Dedco, la marketplace
        béninoise de l'aménagement intérieur. Stack Next.js 16, séparation stricte des rôles,
        moteur métier brief-artisan, 60+ pages dynamiques. Synthèse des 21+ corrections
        d'audit et des chantiers ouverts.
      </div>
      <div class="meta">
        <strong>Préparé par</strong> Équipe Dedco<span class="sep">·</span>
        <strong>Version</strong> 1.0<span class="sep">·</span>
        <strong>Date</strong> 3 juillet 2026
      </div>
    </div>
    <div class="footer">
      <span>Dedco · Cotonou, Bénin</span>
      <span>Document confidentiel</span>
    </div>
  </div>
</div>
</body>
</html>
"""

def build_cover_pdf(html_path, pdf_path):
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(COVER_HTML)
    # Validate
    subprocess.run([
        "python3", f"{PDF_SKILL_DIR}/scripts/poster_validate.py", "check-html", html_path,
    ], capture_output=True)
    # Render via html2poster.js
    subprocess.run([
        "node", f"{PDF_SKILL_DIR}/scripts/html2poster.js",
        html_path, "--output", pdf_path, "--width", "794px",
    ], check=True)
    print(f"✓ Cover PDF: {pdf_path}")

# ── Merge cover + body ──
def merge_cover_body(cover_pdf, body_pdf, output_pdf):
    from pypdf import PdfReader, PdfWriter
    A4_W, A4_H = 595.28, 841.89

    def normalize(page):
        box = page.mediabox
        w, h = float(box.width), float(box.height)
        # Force scale to exact A4 if even slight mismatch
        if abs(w - A4_W) > 0.5 or abs(h - A4_H) > 0.5:
            page.scale_to(A4_W, A4_H)
        return page

    writer = PdfWriter()
    cover_page = PdfReader(cover_pdf).pages[0]
    writer.add_page(normalize(cover_page))
    for page in PdfReader(body_pdf).pages:
        writer.add_page(normalize(page))
    writer.add_metadata({
        "/Title": "Dedco — Architecture Technique & Produit",
        "/Author": "Z.ai",
        "/Creator": "Z.ai",
        "/Subject": "Document d'architecture de la marketplace Dedco",
    })
    with open(output_pdf, "wb") as f:
        writer.write(f)
    print(f"✓ Final PDF: {output_pdf}")

# ── Main ──
if __name__ == "__main__":
    out_dir = "/home/z/my-project/download"
    os.makedirs(out_dir, exist_ok=True)
    tmp_dir = "/home/z/my-project/scripts/tmp_dedco_arch"
    os.makedirs(tmp_dir, exist_ok=True)

    body_pdf = os.path.join(tmp_dir, "body.pdf")
    cover_pdf = os.path.join(tmp_dir, "cover.pdf")
    cover_html = os.path.join(tmp_dir, "cover.html")
    final_pdf = os.path.join(out_dir, "dedco-architecture.pdf")

    build_body_pdf(body_pdf)
    build_cover_pdf(cover_html, cover_pdf)
    merge_cover_body(cover_pdf, body_pdf, final_pdf)

    # Stats
    size_kb = os.path.getsize(final_pdf) / 1024
    from pypdf import PdfReader
    pages = len(PdfReader(final_pdf).pages)
    print(f"\n{'='*50}")
    print(f"PDF généré : {final_pdf}")
    print(f"Taille : {size_kb:.0f} KB")
    print(f"Pages : {pages}")
    print(f"{'='*50}")
