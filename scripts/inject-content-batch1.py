#!/usr/bin/env python3
"""Inject all content sections into the main div of the brand book HTML."""
from pathlib import Path

HTML = Path("/home/z/my-project/public/dedcco-design-system.html").read_text(encoding="utf-8")

# Read icon paths extracted from lucide-react
import json
icons = {}
icons_file = Path("/tmp/lucide-icons.json")
if icons_file.exists():
    icons = json.loads(icons_file.read_text())

def icon_svg(name, size=22):
    inner = icons.get(name, "")
    if not inner:
        return f'<span style="color:#ccc;font-size:10px;">[{name}]</span>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="var(--text-1)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">{inner}</svg>'

# Icon categories
ICONS_BY_CAT = [
    ("Navigation principale", [
        ("home", "Home", "Accueil, sidebar footer"),
        ("search", "Search", "Recherche globale, marketplace"),
        ("heart", "Heart", "Favoris, wishlist produits"),
        ("shopping-bag", "ShoppingBag", "Panier, commande"),
        ("user", "User", "Profil, compte utilisateur"),
        ("bell", "Bell", "Notifications (pulse si non-lus)"),
        ("menu", "Menu", "Drawer mobile, hamburger"),
        ("x", "X", "Fermer modale, annuler"),
    ]),
    ("Sidebar Designer", [
        ("layout-dashboard", "LayoutDashboard", "Dashboard designer"),
        ("file-text", "FileText", "Mes briefs (badge brouillons)"),
        ("folder-kanban", "FolderKanban", "Mes projets en fabrication"),
        ("message-circle", "MessageCircle", "Messages (badge non-lus)"),
        ("settings", "Settings", "Paramètres compte"),
    ]),
    ("Sidebar Artisan", [
        ("hammer", "Hammer", "Dashboard artisan (atelier)"),
        ("package", "Package", "Mes produits (catalogue)"),
        ("bar-chart-3", "BarChart3", "Statistiques business"),
        ("award", "Award", "Profil + niveau N1-N4"),
    ]),
    ("Sidebar Admin", [
        ("users", "Users", "Gestion utilisateurs + KYC"),
        ("clipboard-list", "ClipboardList", "Suivi commandes + litiges"),
    ]),
    ("Actions CRUD", [
        ("plus", "Plus", "Ajouter, créer nouveau"),
        ("check", "Check", "Valider, confirmer"),
        ("trash-2", "Trash2", "Supprimer (destructive)"),
        ("edit", "Edit", "Modifier, éditer"),
        ("eye", "Eye", "Voir détail, preview"),
        ("download", "Download", "Télécharger facture, image"),
        ("share-2", "Share2", "Partager brief, produit"),
        ("copy", "Copy", "Dupliquer brief, copier ID"),
    ]),
    ("Statuts & feedback", [
        ("check-circle-2", "CheckCircle2", "Succès — projet converti"),
        ("clock", "Clock", "En attente — brief publié"),
        ("alert-circle", "AlertCircle", "Attention — brief expiré"),
        ("x-circle", "XCircle", "Erreur — paiement failed"),
        ("loader-2", "Loader2", "Loading (avec .dedco-spin)"),
    ]),
    ("E-commerce & paiement", [
        ("shopping-cart", "ShoppingCart", "Panier détaillé, checkout"),
        ("credit-card", "CreditCard", "Paiement carte, acompte"),
        ("tag", "Tag", "Catégorie produit, promotion"),
        ("percent", "Percent", "Remise, commission plateforme"),
    ]),
    ("Flèches & navigation", [
        ("chevron-right", "ChevronRight", "Déplier arbo, breadcrumb"),
        ("chevron-down", "ChevronDown", "Déplier accordion, dropdown"),
        ("arrow-right", "ArrowRight", "CTA suivant, pagination"),
        ("arrow-left", "ArrowLeft", "Retour, précédent"),
        ("filter", "Filter", "Filtres marketplace"),
        ("more-horizontal", "MoreHorizontal", "Menu contextuel, options"),
    ]),
    ("Communication", [
        ("mail", "Mail", "Email, contact"),
        ("phone", "Phone", "Téléphone (formaté Bénin)"),
        ("send", "Send", "Envoyer message"),
    ]),
    ("Évaluation", [
        ("star", "Star", "Rating (couleur amber)"),
    ]),
]

# Build icons HTML
icons_html_parts = []
for cat_name, items in ICONS_BY_CAT:
    icons_html_parts.append(f'<h3 class="sub">{cat_name}</h3>')
    icons_html_parts.append('<div class="icon-grid">')
    for icon_key, pascal_name, usage in items:
        svg = icon_svg(icon_key, size=24)
        icons_html_parts.append(f'<div class="icon-card"><div class="icon-visual">{svg}</div><div class="icon-name">{pascal_name}</div><div class="icon-usage">{usage}</div></div>')
    icons_html_parts.append('</div>')
icons_html = "\n".join(icons_html_parts)

CONTENT = '''
<!-- ============== SECTION 1 : Sommaire & Introduction ============== -->
<div class="section-header">
  <div class="section-num">01 — Ouverture</div>
  <h2 class="section-title">Sommaire & introduction</h2>
  <div class="section-rule"></div>
</div>

<p class="lead">Ce document est la <strong>référence officielle</strong> du design system Dedcco. Il documente l'état actuel du projet après les refontes récentes — palette stricte à trois couleurs, typographie Quache + Plus Jakarta Sans, classes utilitaires <code>.dedco-*</code>, moteur de brief-artisan à machine à états, et quatre espaces rôles (client, designer, artisan, admin).</p>

<p>Il s'adresse en priorité aux <strong>développeurs frontend</strong> qui rejoignent le projet, aux <strong>designers</strong> qui doivent étendre les composants existants sans casser la cohérence visuelle, et aux <strong>nouveaux arrivants</strong> qui ont besoin d'une carte complète avant de toucher au code. Le document est volontairement exhaustif : il couvre à la fois la couche sémantique (tokens CSS), la couche composition (classes <code>.dedco-*</code>), la couche application (composants shadcn/ui dérivés), et la couche métier (le moteur brief-artisan qui orchestre les statuts, transitions et permissions).</p>

<h3 class="sub">Philosophie du système</h3>

<p>Le parti pris de Dedcco est <em>la terre cuite africaine rencontrée à l'éditorial premium</em>. Trois couleurs seulement — <strong>Amber</strong>, <strong>Terracotta</strong>, <strong>Forest</strong> — portent toutes les décisions visuelles. Aucune couleur parasite, aucun dégradé voyant. La typographie joue sur la tension entre une display serif (Quache) réservée aux mots, et une sans-serif (Plus Jakarta Sans) qui prend en charge les chiffres via un pattern <code>unicode-range</code> ingénieux. Ce parti pris éditorial — serif pour les mots, sans pour les chiffres — donne à l'interface un côté magazine que peu de marketplaces osent.</p>

<p>Sur le plan technique, le système repose sur trois couches strictement séparées : <strong>(1)</strong> les <em>design tokens</em> CSS dans <code>globals.css</code>, qui définissent la palette, les rayons, les ombres ; <strong>(2)</strong> les classes <code>.dedco-*</code> dans <code>@layer components</code>, qui composent les patterns UI récurrents (boutons, badges, cards) ; <strong>(3)</strong> les composants shadcn/ui dans <code>src/components/ui/</code>, qui fournissent la cinquantaine de primitives Radix déjà stylées aux tokens Dedcco. Cette séparation évite qu'un changement de palette ne casse le code produit, et qu'un nouveau composant shadcn n'introduise une couleur non conformée.</p>

<h3 class="sub">Comment lire ce document</h3>

<ul>
  <li><strong>Sections 1 à 8</strong> — Couche sémantique : identité, palette, typographie, tokens. À lire en premier par tous.</li>
  <li><strong>Sections 9 à 17</strong> — Couche composition : boutons, badges, cards, layouts par rôle. Référence quotidienne pour devs et designers.</li>
  <li><strong>Sections 18 à 22</strong> — Moteur brief-artisan : la machine à états qui orchestre le cœur métier de la plateforme.</li>
  <li><strong>Sections 23 à 31</strong> — Motion, accessibilité, conventions de code, onboarding, annexe.</li>
</ul>

<div class="callout">
  <strong>Convention de nommage.</strong> Tout ce qui est préfixé <code>.dedco-*</code> est un pattern custom Dedcco (couche composition). Tout ce qui vient de <code>src/components/ui/*</code> est un primitive shadcn (couche application) re-stylée aux tokens Dedcco. Les deux couches coexistent — ne pas confondre.
</div>

<!-- ============== SECTION 2 : Identité de marque ============== -->
<div class="section-header">
  <div class="section-num">02 — Marque</div>
  <h2 class="section-title">L'histoire Dedcco</h2>
  <div class="section-rule"></div>
</div>

<p class="lead">Dedcco est un <strong>marché de l'aménagement intérieur béninois</strong> qui connecte trois acteurs : les <strong>clients</strong> qui veulent meubler ou décorer leur espace, les <strong>designers</strong> qui conçoivent les plans et l'identité visuelle d'une pièce, et les <strong>artisans</strong> qui fabriquent à la main — mobilier iroko, sièges en wax, luminaires, céramique, textile. La plateforme fait exister cette chaîne de valeur dans un cadre numérique qui respecte les savoir-faire locaux.</p>

<h3 class="sub">Mission et positionnement</h3>

<p>La mission affichée est de <em>révéler la création artisanale béninoise</em>. Concrètement, ça veut dire trois choses : donner aux artisans un canal de vente digne (pas un Facebook Marketplace déguisé), donner aux clients une expérience d'achat premium (pas une fouille dans des photos floues), et donner aux designers un rôle d'intermédiaire créatif reconnu (pas un simple sous-traitant). Le design system porte cette triple promesse — la chaleur du fait-main dans un cadre éditorial premium.</p>

<p>Le positionnement se lit dans le vocabulaire visuel : la palette terre cuite rappelle le Bénin (latérite, bogolan, banco), les polices respirent l'éditorial international (Quache est une display sans concession, Plus Jakarta Sans est un standard du SaaS moderne), les motifs séparateurs reprennent les trois points bogolan. Le tout est calibré pour ne jamais tomber dans le pastiche ethnique — c'est du contemporain qui assume son ancrage.</p>

<h3 class="sub">Signature visuelle</h3>

<div class="callout forest">
  <strong>Logotype.</strong> Le brand s'écrit <code style="color:var(--forest);background:white;padding:1px 5px;border-radius:3px;font-family:'SF Mono',monospace;font-size:10.5px">Dedco<span style="color:var(--amber)">.</span></code> — le point final en <strong>Amber</strong> #BF793B est un signature minimaliste, présente dans la sidebar, le header du site, et la documentation. Toujours utiliser <code style="color:var(--forest);background:white;padding:1px 5px;border-radius:3px;font-family:'SF Mono',monospace;font-size:10.5px">font-display</code> (Quache) pour ce logotype.
</div>

<p>La signature sonore et visuelle repose sur trois valeurs : <strong>artisanat</strong> (chaque pièce est unique, faite à la main), <strong>authenticité</strong> (les matériaux sont locaux — iroko, wax, bogolan, céramique de Cotonou), et <strong>confiance</strong> (paiement sécurisé Mobile Money, badges de vérification, suivi de projet transparent). Ces valeurs se traduisent en patterns UI : les fiches produit montrent toujours l'artisan et sa localisation, les briefs affichent un statut explicite, les projets suivent un workflow public côté client.</p>

<h3 class="sub">Le point bogolan</h3>

<p>Le séparateur décoratif <code>.dedco-divider</code> reprend trois pastilles — <strong>Amber</strong>, <strong>Terracotta</strong>, <strong>Forest</strong> — entre deux filets. C'est un clin d'œil aux motifs bogolan traditionnels (tissus teints à la boue, Mali et Bénin), sans imitation littérale. Ce motif apparaît dans les chapitres de ce document, dans les séparateurs de section du site, et comme signature subtile dans les emails transactionnels. À utiliser avec parcimonie — c'est un accent, pas un ornement.</p>

<div class="preview">
  <div class="preview-label">Séparateur bogolan — .dedco-divider</div>
  <div style="display:flex;align-items:center;gap:8px;width:100%;margin:8px 0;">
    <div style="flex:1;height:1px;background:var(--border);"></div>
    <div style="width:6px;height:6px;border-radius:50%;background:var(--amber);"></div>
    <div style="width:6px;height:6px;border-radius:50%;background:var(--terracotta);"></div>
    <div style="width:6px;height:6px;border-radius:50%;background:var(--forest);"></div>
    <div style="flex:1;height:1px;background:var(--border);"></div>
  </div>
</div>

<!-- ============== SECTION 3 : Palette officielle ============== -->
<div class="section-header">
  <div class="section-num">03 — Palette</div>
  <h2 class="section-title">Amber · Terracotta · Forest</h2>
  <div class="section-rule"></div>
</div>

<p class="lead">La palette Dedcco est <strong>strictement limitée à trois couleurs primaires</strong>, chacune déclinée en quatre variants (dark, base, light, pale). Aucune autre couleur n'est admise dans l'interface — pas de bleu pour les liens, pas de rouge pour les erreurs, pas de jaune pour les warnings. Cette discipline est ce qui donne au site sa signature visuelle immédiatement reconnaissable.</p>

<h3 class="sub">Les trois couleurs primaires</h3>

<div class="swatch-grid">
  <div class="swatch">
    <div class="swatch-chip" style="background:var(--amber);"></div>
    <div class="swatch-name">Amber</div>
    <div class="swatch-meta">#BF793B · RGB(191, 121, 59)<br>HSL(28°, 53%, 49%)<br>var(--amber)</div>
    <div class="swatch-use">Chaleur, accent principal, CTA primaires, focus ring</div>
  </div>
  <div class="swatch">
    <div class="swatch-chip" style="background:var(--terracotta);"></div>
    <div class="swatch-name">Terracotta</div>
    <div class="swatch-meta">#A6442E · RGB(166, 68, 46)<br>HSL(11°, 57%, 42%)<br>var(--terracotta)</div>
    <div class="swatch-use">Ancrage, contraste, erreurs/destructive, sélection artisan</div>
  </div>
  <div class="swatch">
    <div class="swatch-chip" style="background:var(--forest);"></div>
    <div class="swatch-name">Forest</div>
    <div class="swatch-meta">#548C45 · RGB(84, 140, 69)<br>HSL(108°, 34%, 41%)<br>var(--forest)</div>
    <div class="swatch-use">Validation, succès, projets convertis, badges de statut positif</div>
  </div>
  <div class="swatch">
    <div class="swatch-chip" style="background:linear-gradient(135deg,var(--amber-dark) 0%,var(--amber) 33%,var(--amber-light) 66%,var(--amber-pale) 100%);"></div>
    <div class="swatch-name">Déclinaisons Amber</div>
    <div class="swatch-meta">dark #9A5A1F · base #BF793B<br>light #D4954A · pale #F5E6D3</div>
    <div class="swatch-use">Hover states, fonds doux, badges, secondary buttons</div>
  </div>
</div>

<h3 class="sub">Usage sémantique des trois couleurs</h3>

<p>Chaque couleur a un rôle sémantique précis, et ce rôle est appliqué de façon systématique sur toute la plateforme. L'<strong>Amber</strong> est la couleur de l'action et de la chaleur — c'est le bouton primaire, le focus ring, l'eyebrow de section, les étoiles de rating, la sélection active dans la sidebar. La <strong>Terracotta</strong> est la couleur de l'ancrage et du contraste — elle marque les états critiques (sélection d'artisan, paiement en attente), les actions destructives (annuler, supprimer), et le brand point final. Le <strong>Forest</strong> est la couleur de la validation et de la confiance — il apparaît sur les badges "vérifié", les statuts de succès (projet converti, paiement confirmé), et l'accent des éléments de confiance.</p>

<p>Cette tripartition sémantique se reflète directement dans le mapping Tailwind : <code>primary → amber</code>, <code>destructive → terracotta</code>, <code>accent → forest-pale</code> avec <code>accent-foreground → forest</code>. Les composants shadcn/ui héritent donc automatiquement de la bonne couleur selon leur rôle — un <code>Button variant="destructive"</code> sera terracotta sans qu'aucune classe supplémentaire ne soit nécessaire.</p>

<div class="callout terra">
  <strong>Discipline absolue.</strong> Ne jamais introduire une quatrième couleur. Si un besoin UI semble exiger une nouvelle couleur (info, warning, etc.), c'est le signe qu'il faut reconsidérer le pattern — probablement en utilisant un variant pale d'une couleur existante ou un badge gris. La palette est fermée par design.
</div>

<h3 class="sub">Variant pale pour les fonds</h3>

<p>Chaque couleur primaire a un variant <em>pale</em> (saturation très basse, luminosité haute) utilisé pour les fonds de badges, les états actifs de navigation, et les zones d'accentuation douce. Ces variants — <code>#F5E6D3</code> (amber-pale), <code>#FAEAE6</code> (terracotta-pale), <code>#E6F2E3</code> (forest-pale) — permettent d'évoquer la couleur sans saturer l'œil. Ils suivent la règle d'or <em>Area ∝ 1/Saturation</em> : plus la surface est grande, plus la saturation doit être basse.</p>
'''

# Insert content into the main div
HTML = HTML.replace('<div class="main">\n\n</div>', f'<div class="main">\n\n{CONTENT}\n\n</div>')

# Save back
Path("/home/z/my-project/public/dedcco-design-system.html").write_text(HTML, encoding="utf-8")
print(f"✓ Inserted content batch 1 (sections 1-3)")
print(f"  HTML size: {len(HTML)//1024}KB")
